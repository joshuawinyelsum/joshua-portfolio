import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const DIST_DIR = path.resolve('dist');
const PORT = 4199;
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

function startServer(): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = (req.url || '/').split('?')[0];
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

  async captureScreenshot(filename: string, clip?: { x: number; y: number; width: number; height: number; scale: number }) {
    const params: any = { format: 'png' };
    if (clip) {
      params.clip = clip;
    }
    const res = await this.send('Page.captureScreenshot', params);
    if (res && res.data) {
      const buffer = Buffer.from(res.data, 'base64');
      fs.writeFileSync(path.join(OUT_DIR, filename), buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }
  }

  async scrollToSelector(selector: string) {
    return this.eval(`
      (() => {
        const el = document.querySelector('${selector}');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
          return true;
        }
        return false;
      })()
    `);
  }

  async getElementRect(selector: string) {
    return this.eval(`
      (() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      })()
    `);
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log('=== CAPTURING VISUAL QA SCREENSHOTS ===\n');
  const server = await startServer();
  console.log(`Server started on http://127.0.0.1:${PORT}`);

  const tmpDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'edge-qa-' + Date.now());
  const edgeProcess = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9223',
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
      versionRes = await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' });
      if (versionRes.ok) break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!versionRes || !versionRes.ok) {
    throw new Error('Edge headless did not respond on debugging port 9223');
  }

  const target = await versionRes.json();
  const cdp = new CDPClient();
  await cdp.connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // 1. DESKTOP CAPTURES (1440x900)
  console.log('\n--- Desktop (1440px) Captures ---');
  await cdp.setViewport(1440, 900, false);
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  
  // Wait until app is hydrated
  for (let i = 0; i < 20; i++) {
    const hasHero = await cdp.eval(`Boolean(document.querySelector('#hero h1'))`);
    if (hasHero) break;
    await wait(250);
  }
  await wait(800);

  // Hero
  await cdp.eval(`window.scrollTo(0, 0)`);
  await wait(400);
  await cdp.captureScreenshot('desktop-01-hero.png');

  // Story
  await cdp.scrollToSelector('#story');
  await wait(500);
  await cdp.captureScreenshot('desktop-02-story.png');

  // Selected Work
  await cdp.scrollToSelector('#work');
  await wait(600);
  await cdp.captureScreenshot('desktop-03-work.png');

  // Selected Work 3-Project Gallery Row
  await cdp.eval(`window.scrollBy(0, 680)`);
  await wait(500);
  await cdp.captureScreenshot('desktop-03b-work-gallery.png');

  // Leadership & Community
  await cdp.scrollToSelector('#leadership');
  await wait(500);
  await cdp.captureScreenshot('desktop-04-leadership.png');

  // Currently Building
  await cdp.scrollToSelector('#building');
  await wait(500);
  await cdp.captureScreenshot('desktop-05-building.png');

  // Education with GPA
  await cdp.eval(`
    (() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const eduHeading = headings.find(h => h.textContent.includes('Education'));
      if (eduHeading) {
        eduHeading.closest('section').scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    })()
  `);
  await wait(500);
  await cdp.captureScreenshot('desktop-06-education.png');

  // Contact
  await cdp.scrollToSelector('#contact');
  await wait(500);
  await cdp.captureScreenshot('desktop-07-contact.png');

  // CV Page Desktop
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/cv` });
  await wait(1000);
  await cdp.captureScreenshot('desktop-08-cv-header.png');
  await cdp.eval(`
    (() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const eduHeading = headings.find(h => h.textContent.includes('Education'));
      if (eduHeading) {
        eduHeading.closest('section').scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    })()
  `);
  await wait(500);
  await cdp.captureScreenshot('desktop-09-cv-education.png');

  // Case Study Desktop
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/case-study/coach-prospers-world` });
  await wait(1000);
  await cdp.captureScreenshot('desktop-10-case-study.png');

  // 2. TABLET CAPTURES (768x1024)
  console.log('\n--- Tablet (768px) Captures ---');
  await cdp.setViewport(768, 1024, false);
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await wait(1500);
  await cdp.scrollToSelector('#hero');
  await wait(400);
  await cdp.captureScreenshot('tablet-01-hero.png');

  await cdp.scrollToSelector('#work');
  await wait(400);
  await cdp.captureScreenshot('tablet-02-work.png');

  await cdp.scrollToSelector('#leadership');
  await wait(400);
  await cdp.captureScreenshot('tablet-03-leadership.png');

  // 3. MOBILE CAPTURES (390x844 - iPhone)
  console.log('\n--- Mobile (390px) Captures ---');
  await cdp.setViewport(390, 844, true);
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await wait(1500);

  // Mobile Hero
  await cdp.scrollToSelector('#hero');
  await wait(400);
  await cdp.captureScreenshot('mobile-01-hero.png');

  // Mobile Story
  await cdp.scrollToSelector('#story');
  await wait(400);
  await cdp.captureScreenshot('mobile-02-story.png');

  // Mobile Work
  await cdp.scrollToSelector('#work');
  await wait(400);
  await cdp.captureScreenshot('mobile-03-work.png');

  // Mobile Leadership
  await cdp.scrollToSelector('#leadership');
  await wait(400);
  await cdp.captureScreenshot('mobile-04-leadership.png');

  // Mobile Currently Building
  await cdp.scrollToSelector('#building');
  await wait(400);
  await cdp.captureScreenshot('mobile-05-building.png');

  // Mobile Education
  await cdp.eval(`
    (() => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const eduHeading = headings.find(h => h.textContent.includes('Education'));
      if (eduHeading) {
        eduHeading.closest('section').scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    })()
  `);
  await wait(400);
  await cdp.captureScreenshot('mobile-06-education.png');

  // Mobile Contact
  await cdp.scrollToSelector('#contact');
  await wait(400);
  await cdp.captureScreenshot('mobile-07-contact.png');

  // Mobile CV
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/cv` });
  await wait(1000);
  await cdp.captureScreenshot('mobile-08-cv.png');

  // Clean up
  cdp.close();
  try { edgeProcess.kill(); } catch {}
  server.close();
  console.log('\n[DONE] All QA screenshots captured successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('QA Screenshot Capture failed:', err);
  process.exit(1);
});
