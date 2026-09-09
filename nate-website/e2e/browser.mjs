// Locating a browser without depending on `playwright` proper: playwright-core
// ships no browsers and no installer, which is the trade for not pulling ~150MB
// into node_modules on every npm install. Set SMOKE_BROWSER to override.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

export function findBrowser() {
  if (process.env['SMOKE_BROWSER']) return process.env['SMOKE_BROWSER'];

  // Whatever Playwright has already cached, newest build first.
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  if (existsSync(cache)) {
    const builds = readdirSync(cache)
      .filter(d => d.startsWith('chromium'))
      .sort((a, b) => (parseInt(b.split('-').pop()) || 0) - (parseInt(a.split('-').pop()) || 0));
    for (const b of builds) {
      for (const rel of ['chrome-mac/headless_shell', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const p = join(cache, b, rel);
        if (existsSync(p)) return p;
      }
    }
  }
  const sys = CANDIDATES.find(existsSync);
  if (sys) return sys;

  throw new Error(
    'No Chromium found. Set SMOKE_BROWSER=/path/to/chrome, or install one with:\n' +
    '  npx playwright install chromium',
  );
}
