import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const DIST_DIR = path.resolve('dist');
const PORT = 4188;
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

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

// 1. Static file server for dist/
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
      } catch (err) {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(PORT, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

// 2. CDP Helper
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

  close() {
    this.ws.close();
  }
}

async function runAudit() {
  console.log('=== MULTI-VIEWPORT RESPONSIVENESS & OVERFLOW AUDIT ===\n');

  const server = await startServer();
  console.log(`[OK] Local static server active at http://127.0.0.1:${PORT}`);

  const tmpDir = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'edge-audit-' + Date.now());

  const edgeProcess = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      '--user-data-dir=' + tmpDir,
      '--disable-gpu',
      '--no-sandbox',
      '--disable-extensions',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  // Poll for debugging port to be ready
  let versionRes;
  for (let i = 0; i < 30; i++) {
    try {
      versionRes = await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' });
      if (versionRes.ok) break;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (!versionRes || !versionRes.ok) {
    throw new Error('Edge headless did not respond on debugging port 9222');
  }
  const target = await versionRes.json();
  const cdp = new CDPClient();
  await cdp.connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');

  const viewports = [
    { name: '320px (Small Mobile / SE)', width: 320, height: 568 },
    { name: '360px (Standard Android)', width: 360, height: 640 },
    { name: '375px (iPhone 6/7/8/X)', width: 375, height: 667 },
    { name: '390px (iPhone 12/13/14)', width: 390, height: 844 },
    { name: '430px (iPhone Pro Max)', width: 430, height: 932 },
    { name: '768px (iPad / Tablet)', width: 768, height: 1024 },
    { name: '1024px (Small Laptop / iPad Pro)', width: 1024, height: 768 },
    { name: '1280px (Standard Desktop)', width: 1280, height: 800 },
    { name: '1440px (Large Desktop)', width: 1440, height: 900 },
  ];

  const routes = [
    { name: 'Home Route (/)', path: '/' },
    { name: 'Curriculum Vitae (/cv)', path: '/cv' },
    { name: 'Case Study: Coach Prosper’s World', path: '/case-study/coach-prospers-world' },
    { name: 'Case Study: CFSS Offline Platform', path: '/case-study/cfss' },
    { name: 'Case Study: MasteryOS Learning Engine', path: '/case-study/mastery-os' },
    { name: 'Case Study: AgriChem Research', path: '/case-study/agrichem' },
  ];

  let totalTests = 0;
  let passedTests = 0;
  const failures: string[] = [];

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} [${vp.width}x${vp.height}] ---`);

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768,
    });

    for (const route of routes) {
      totalTests++;
      const fullUrl = `http://127.0.0.1:${PORT}${route.path}`;
      await cdp.send('Page.navigate', { url: fullUrl });

      // Wait until the app has actually mounted (a slow font or network
      // request must not let the audit measure an empty page), then let
      // layout settle.
      for (let attempt = 0; attempt < 100; attempt++) {
        const mounted = await cdp.eval(
          `location.pathname === ${JSON.stringify(route.path)} && (document.getElementById('root')?.childElementCount ?? 0) > 0`
        );
        if (mounted) break;
        await new Promise((r) => setTimeout(r, 100));
      }
      await new Promise((r) => setTimeout(r, 400));

      const overflowData = await cdp.eval(`(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const hasOverflow = scrollWidth > docWidth + 1 || bodyScrollWidth > docWidth + 1;
        
        let offendingElements = [];
        if (hasOverflow) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 1 || rect.width > docWidth + 1) {
              const tag = el.tagName.toLowerCase();
              const cls = (el.className || '').toString().slice(0, 40);
              offendingElements.push(tag + '.' + cls + ' (w=' + Math.round(rect.width) + 'px, r=' + Math.round(rect.right) + 'px)');
              if (offendingElements.length >= 3) break;
            }
          }
        }

        return {
          docWidth,
          scrollWidth,
          bodyScrollWidth,
          hasOverflow,
          offending: offendingElements
        };
      })()`);

      if (!overflowData.hasOverflow) {
        passedTests++;
        console.log(`  [PASS] ${route.name}: scrollWidth=${overflowData.scrollWidth} <= clientWidth=${overflowData.docWidth}`);
      } else {
        const failMsg = `[FAIL] ${vp.name} on ${route.name}: scrollWidth=${overflowData.scrollWidth} > clientWidth=${overflowData.docWidth}. Offending: ${overflowData.offending.join('; ')}`;
        failures.push(failMsg);
        console.log(`  ${failMsg}`);
      }
    }

    // Also test CommandCenter terminal modal when launched on mobile!
    if (vp.width <= 430) {
      totalTests++;
      await cdp.eval(`(() => {
        // Press Ctrl+K to open CommandCenter
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
      })()`);
      await new Promise((r) => setTimeout(r, 300));

      const modalData = await cdp.eval(`(() => {
        const dialog = document.querySelector('dialog');
        if (!dialog) return { found: false };
        const rect = dialog.getBoundingClientRect();
        const inner = dialog.querySelector('div[role="document"]');
        const innerRect = inner ? inner.getBoundingClientRect() : null;
        return {
          found: true,
          isOpen: dialog.classList.contains('flex'),
          dialogWidth: rect.width,
          innerWidth: innerRect ? innerRect.width : 0,
          windowWidth: window.innerWidth,
          overflow: innerRect ? innerRect.width > window.innerWidth : false
        };
      })()`);

      if (modalData.found && !modalData.overflow) {
        passedTests++;
        console.log(`  [PASS] CommandCenter Modal (width <= ${vp.width}px): Fits viewport cleanly (dialog=${Math.round(modalData.innerWidth)}px <= window=${modalData.windowWidth}px)`);
      } else {
        const failMsg = `[FAIL] CommandCenter Modal overflow on ${vp.name}`;
        failures.push(failMsg);
        console.log(`  ${failMsg}`);
      }

      // Close modal
      await cdp.eval(`(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      })()`);
    }
  }

  console.log(`\n=== AUDIT RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);

  // Cleanup
  cdp.close();
  edgeProcess.kill();
  server.close();

  if (failures.length > 0) {
    console.error('FAILURES DETECTED:');
    failures.forEach((f) => console.error(f));
    process.exit(1);
  } else {
    console.log('ALL VIEWPORTS VERIFIED: Zero horizontal overflow across all routes and devices!');
    process.exit(0);
  }
}

runAudit().catch((err) => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
