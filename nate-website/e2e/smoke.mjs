// End-to-end smoke test for the built site. Deliberately behavioural rather
// than unit-level: it renders every route in a real browser and drives the two
// surfaces with genuine moving parts — the PDF reader and the sql.js dictionary.
//
//   npm run smoke          (expects `npm start` already serving on :4200)
//   SMOKE_URL=... npm run smoke
//
// This is what carried the Angular 15 -> 22 upgrade and the pdf.js rewrite; it
// catches things unit tests on this codebase never did.
import { chromium } from 'playwright-core';
import { findBrowser } from './browser.mjs';

const BASE = process.env['SMOKE_URL'] || 'http://localhost:4200';
const BOOK = 'assets/pdfs/books/EYNTKA-Algebra.pdf';

let pass = 0, fail = 0;
const chk = (name, ok, detail = '') => {
  ok ? pass++ : fail++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? '  ' + detail : ''}`);
};

// Page + how far into it we are, so a re-scale that silently moves the reader
// is visible rather than merely "still on some page".
const position = () => {
  const c = document.querySelector('.pdf-document');
  const top = c.getBoundingClientRect().top;
  const pg = [...c.querySelectorAll('.page')].find(e => e.getBoundingClientRect().bottom > top + 2);
  if (!pg) return null;
  const r = pg.getBoundingClientRect();
  return { p: +pg.getAttribute('data-page-number'), f: +(((top - r.top) / r.height).toFixed(3)) };
};

const ROUTES = ['/', '/books', '/papers', '/notes', '/blog', '/programming', '/series-map',
                '/dictionary', '/judo', '/about', '/tutoring', '/contact', '/miscellaneous'];

const browser = await chromium.launch({ executablePath: findBrowser() });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const path of ROUTES) {
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text().split('\n')[0]));
  await p.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(600);
  const len = await p.evaluate(() => document.body.innerText.trim().length).catch(() => 0);
  chk(`route ${path.padEnd(14)} renders`, len > 40 && !errs.length,
      `${len} chars${errs.length ? ' err: ' + errs[0].slice(0, 70) : ''}`);
  await p.close();
}

{ // sql.js is loaded as a global script, not bundled — assert a real query
  const p = await ctx.newPage();
  await p.goto(BASE + '/dictionary', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1200);
  const global = await p.evaluate(() => typeof initSqlJs);
  let hit = false;
  for (let i = 0; i < 8 && !hit; i++) {            // .db is fetched lazily
    await p.fill('.search-input', 'water');
    await p.click('.search-button');
    await p.waitForTimeout(2000);
    hit = /水/.test(await p.evaluate(() => document.body.innerText));
  }
  chk('dictionary queries sql.js', global === 'function' && hit, `initSqlJs: ${global}`);
  await p.close();
}

{ // the reader
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text().split('\n')[0]));
  await p.addInitScript(() => localStorage.setItem('reader.outline.open', '1'));
  await p.goto(`${BASE}/pdf-viewer?src=${BOOK}&name=Algebra`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.outline-toggle', { timeout: 120000 });
  await p.waitForTimeout(1500);

  chk('reader: outline built', (await p.locator('.outline-row').count()) > 5);
  chk('reader: page count', (await p.locator('.page-total').textContent()).includes('2053'));
  chk('reader: printed page label',
      (await p.locator('.outline-row[data-level="0"] .outline-page').nth(3).textContent()).trim() === '253');

  await p.fill('.outline-filter-input', 'divisible');
  await p.waitForTimeout(500);
  await p.locator('.outline-link').first().click();
  await p.waitForTimeout(1800);
  const a = await p.evaluate(position);
  // Lands on the section's page. The within-page offset is exact on pdf.js 2.x
  // but dropped on 6.x for long jumps — see goToDestination in
  // pdf-document.component.ts. Asserting the page keeps this honest rather than
  // green-by-weakening.
  chk('reader: TOC -> destination page', a?.p === 695, JSON.stringify(a));

  for (const s of ['last', 'last', 'first', 'first']) {
    await p.click(`.zoom-controls button:${s}-child`);
    await p.waitForTimeout(900);
  }
  const b = await p.evaluate(position);
  chk('reader: zoom keeps place', b?.p === a.p && Math.abs(b.f - a.f) < 0.02, JSON.stringify(b));

  await p.setViewportSize({ width: 900, height: 700 });
  await p.waitForTimeout(1400);
  const c = await p.evaluate(position);
  chk('reader: resize keeps place', c?.p === a.p && Math.abs(c.f - a.f) < 0.03, JSON.stringify(c));
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.waitForTimeout(1200);

  await p.fill('.page-input', '450');
  await p.locator('.page-input').press('Enter');
  await p.waitForTimeout(1500);
  await p.click('.mode-toggle');
  await p.waitForTimeout(2000);
  const single = await p.evaluate(() => ({
    v: document.querySelector('.page-input').value,
    n: document.querySelectorAll('.pdf-document .page').length,
  }));
  await p.click('.mode-toggle');
  await p.waitForTimeout(2000);
  const back = await p.evaluate(() => document.querySelector('.page-input').value);
  chk('reader: mode toggle', single.v === '450' && single.n === 1 && back === '450',
      `${JSON.stringify(single)} back=${back}`);

  await p.fill('.page-input', '696');
  await p.locator('.page-input').press('Enter');
  await p.waitForTimeout(2000);
  chk('reader: text layer',
      (await p.evaluate(() => document.querySelectorAll('.pdf-document .textLayer span').length)) > 100);
  chk('reader: link annotations',
      (await p.evaluate(() => document.querySelectorAll('.pdf-document .annotationLayer a').length)) > 0);

  await p.locator('.pdf-viewer-wrapper').click({ position: { x: 10, y: 10 } });
  await p.keyboard.press('t');
  await p.waitForTimeout(600);
  const closed = !(await p.evaluate(() => document.querySelector('.outline-shell').classList.contains('visible')));
  await p.keyboard.press('t');
  await p.waitForTimeout(600);
  chk('reader: t toggles contents',
      closed && await p.evaluate(() => document.querySelector('.outline-shell').classList.contains('visible')));
  chk('reader: no console errors', errs.length === 0, errs[0]?.slice(0, 80) || '');
  await p.close();
}

{ // ?loc= resolves a stable label through the shipped index to a physical page
  const p = await ctx.newPage();
  await p.goto(`${BASE}/pdf-viewer?src=assets/pdfs/books/EYNTKA-core-algebra.pdf&name=C&loc=df:grp`,
               { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.outline-toggle', { timeout: 120000 });
  await p.waitForTimeout(2500);
  chk('deep link ?loc=', (await p.evaluate(() => document.querySelector('.page-input').value)) === '17');
  await p.close();
}

{ // the reader must only ever open this site's own documents
  for (const [src, want] of [[BOOK, 'allow'],
                             ['https://example.com/evil.pdf', 'block'],
                             ['//example.com/evil.pdf', 'block'],
                             ['assets/pdfs/../../../etc/passwd', 'block']]) {
    const p = await ctx.newPage();
    await p.goto(`${BASE}/pdf-viewer?src=${encodeURIComponent(src)}&name=T`, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(3000);
    const blocked = await p.evaluate(() => !!document.querySelector('.error-message'));
    const pages = await p.evaluate(() => document.querySelectorAll('.pdf-document .page').length);
    const got = blocked ? 'block' : (pages > 0 ? 'allow' : 'neither');
    chk(`src guard ${want.padEnd(5)} ${src.slice(0, 34)}`, got === want, `-> ${got}`);
    await p.close();
  }
}

{ // leaving the reader by in-app navigation, not a fresh page load — the
  // teardown path, which closing a tab never exercises
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text().split('\n')[0]));
  p.on('pageerror', e => errs.push('pageerror: ' + String(e).split('\n')[0]));
  await p.goto(BASE + '/books', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1000);
  await p.locator('.book-row').first().click();
  await p.waitForSelector('.outline-toggle', { timeout: 120000 });
  await p.waitForTimeout(2000);
  errs.length = 0;
  await p.click('.back-button');
  await p.waitForTimeout(2500);
  const rows = await p.evaluate(() => document.querySelectorAll('.book-row').length);
  chk('back out of the reader', rows > 0 && errs.length === 0,
      `${rows} book rows${errs.length ? '; ' + errs[0].slice(0, 70) : ''}`);
  await p.close();
}

{ // cross-book search
  const p = await ctx.newPage();
  await p.goto(BASE + '/books', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1000);
  await p.keyboard.press('Meta+k');
  await p.waitForTimeout(1000);
  await p.keyboard.type('yoneda');
  await p.waitForTimeout(1200);
  const n = await p.evaluate(() => document.querySelectorAll('[class*=palette] li, [class*=result]').length);
  chk('command palette', n > 0, `${n} results`);
  await p.close();
}

console.log(`\n  ${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
