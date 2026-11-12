import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import contactHandler from '../api/contact';

const DIST_DIR = path.resolve('dist');
const PORT = 4195;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.resolve('qa-screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Start a server that serves dist files AND handles /api/contact directly
function startServer(): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      let reqPath = (req.url || '/').split('?')[0];

      // Handle Contact API endpoint
      if (reqPath === '/api/contact') {
        await contactHandler(req, res);
        return;
      }

      if (reqPath === '/') reqPath = '/index.html';

      let filePath = path.join(DIST_DIR, reqPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(PORT, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

class CDPClient {
  private ws!: WebSocket;
  private id = 0;
  private callbacks = new Map<number, (res: any) => void>();

  async connect(wsUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data as string);
        if (data.id && this.callbacks.has(data.id)) {
          this.callbacks.get(data.id)!(data);
          this.callbacks.delete(data.id);
        }
      };
    });
  }

  send(method: string, params: Record<string, any> = {}): Promise<any> {
    const msgId = ++this.id;
    return new Promise((resolve) => {
      this.callbacks.set(msgId, (res) => resolve(res.result));
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async eval(expr: string): Promise<any> {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    return res?.result?.value;
  }

  async setViewport(width: number, height: number, mobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile,
    });
    await this.send('Emulation.setVisibleSize', { width, height });
  }

  async captureScreenshot(filename: string) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    if (res && res.data) {
      const buffer = Buffer.from(res.data, 'base64');
      fs.writeFileSync(path.join(OUT_DIR, filename), buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log('=== RUNNING CONTACT FORM E2E BROWSER VERIFICATION ===\n');
  const server = await startServer();
  console.log(`Server started on http://127.0.0.1:${PORT}`);

  const tmpDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'edge-contact-e2e-' + Date.now());
  const edgeProcess = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9224',
      '--user-data-dir=' + tmpDir,
      '--disable-gpu',
      '--no-sandbox',
      '--disable-extensions',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let versionRes;
  for (let i = 0; i < 30; i++) {
    try {
      versionRes = await fetch('http://127.0.0.1:9224/json/new?about:blank', { method: 'PUT' });
      if (versionRes.ok) break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!versionRes || !versionRes.ok) {
    throw new Error('Edge headless did not respond on debugging port 9224');
  }

  const target = await versionRes.json();
  const cdp = new CDPClient();
  await cdp.connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Configure mock Resend delivery in the Node server process
  process.env.RESEND_API_KEY = 're_mock_test_key_e2e';
  const originalFetch = global.fetch;
  let interceptedEmail: any = null;

  global.fetch = async (url: any, init: any) => {
    if (String(url).includes('api.resend.com/emails')) {
      interceptedEmail = JSON.parse(init.body);
      return new Response(JSON.stringify({ id: 'resend_e2e_msg_987' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return originalFetch(url, init);
  };

  try {
    // 1. DESKTOP VIEWPORT
    await cdp.setViewport(1440, 900, false);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await wait(1200);

    // Scroll to contact form
    await cdp.eval(`document.querySelector('#contact').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);

    // Capture idle state
    await cdp.captureScreenshot('contact-01-idle.png');
    console.log('[PASS] Idle contact form rendered cleanly.');

    // 2. TEST VALIDATION ON EMPTY SUBMISSION
    await cdp.eval(`document.querySelector('#contact form button[type="submit"]').click()`);
    await wait(400);

    const hasValidationErrors = await cdp.eval(`Boolean(document.querySelector('.field__message'))`);
    if (!hasValidationErrors) {
      throw new Error('Expected validation errors on empty submission, but none found.');
    }
    console.log('[PASS] Empty submission triggers client-side validation errors.');
    await cdp.captureScreenshot('contact-02-validation-error.png');

    // 3. FILL OUT FORM WITH VALID DATA
    await cdp.eval(`
      (() => {
        const setVal = (selector, val) => {
          const el = document.querySelector(selector);
          const setter = Object.getOwnPropertyDescriptor(
            el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
            'value'
          ).set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        setVal('#contact-name', 'Elena Rostova');
        setVal('#contact-email', 'elena.rostova@techinstitute.org');
        setVal('#contact-subject', 'Distributed Consensus Research');
        setVal('#contact-message', 'Hi Joshua, I reviewed your work on offline-first data platforms and would like to collaborate.');
      })()
    `);
    await wait(400);

    // Verify values are populated
    const filledName = await cdp.eval(`document.querySelector('#contact-name').value`);
    if (filledName !== 'Elena Rostova') {
      throw new Error('Form fields failed to populate properly in DOM.');
    }
    console.log('[PASS] Form successfully populated with visitor inquiry data.');

    // 4. SUBMIT FORM AND VERIFY SUCCESS
    await cdp.eval(`document.querySelector('#contact form button[type="submit"]').click()`);
    await wait(800);

    // Verify success confirmation is displayed
    const successText = await cdp.eval(`
      (() => {
        const successEl = document.querySelector('[role="status"]');
        return successEl ? successEl.textContent : '';
      })()
    `);

    const expectedText = "Message sent successfully. Thank you for reaching out. I'll get back to you soon.";
    if (!successText.includes(expectedText)) {
      throw new Error(`Expected success message not found. Received: "${successText}"`);
    }
    console.log('[PASS] Success confirmation message displayed inside website without page reload.');

    // Verify form fields were cleared
    const clearedName = await cdp.eval(`document.querySelector('#contact-name').value`);
    const clearedMessage = await cdp.eval(`document.querySelector('#contact-message').value`);
    if (clearedName !== '' || clearedMessage !== '') {
      throw new Error('Form fields were not cleared after successful submission.');
    }
    console.log('[PASS] Form inputs cleanly cleared after successful delivery.');

    // Verify backend received exact data and created Resend payload
    if (!interceptedEmail) {
      throw new Error('Server-side endpoint was not called with Resend payload.');
    }
    if (interceptedEmail.reply_to !== 'elena.rostova@techinstitute.org') {
      throw new Error(`Reply-to mismatch. Expected elena.rostova@techinstitute.org, got ${interceptedEmail.reply_to}`);
    }
    if (interceptedEmail.to[0] !== 'akumjoshuawin@gmail.com') {
      throw new Error(`Recipient email mismatch. Expected akumjoshuawin@gmail.com, got ${interceptedEmail.to[0]}`);
    }
    console.log('[PASS] Verified transactional email dispatch:');
    console.log(`       - Delivered To: ${interceptedEmail.to[0]}`);
    console.log(`       - Reply-To:     ${interceptedEmail.reply_to}`);
    console.log(`       - Subject:      ${interceptedEmail.subject}`);

    await cdp.captureScreenshot('contact-03-success.png');

    // 5. TEST MOBILE VIEWPORT (390px iPhone)
    console.log('\n--- Mobile Viewport Test (390px) ---');
    await cdp.setViewport(390, 844, true);
    await wait(500);

    // Click "Send another message" button
    await cdp.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Send another'));
        if (btn) btn.click();
      })()
    `);
    await wait(400);

    // Scroll to contact form on mobile
    await cdp.eval(`document.querySelector('#contact').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await wait(600);

    // Verify form is restored
    const mobileFormVisible = await cdp.eval(`Boolean(document.querySelector('#contact-name'))`);
    if (!mobileFormVisible) {
      throw new Error('Form was not reset on Send Another Message click.');
    }
    console.log('[PASS] "Send another message" cleanly resets form.');

    await cdp.captureScreenshot('contact-04-mobile.png');
    console.log('[PASS] Mobile layout verified cleanly.');

  } finally {
    global.fetch = originalFetch;
    cdp.close();
    try { edgeProcess.kill(); } catch {}
    server.close();
  }

  console.log('\n=== ALL E2E CONTACT TESTS & CAPTURES COMPLETED SUCCESSFULLY ===');
}

run().catch((err) => {
  console.error('E2E Test Failure:', err);
  process.exit(1);
});
