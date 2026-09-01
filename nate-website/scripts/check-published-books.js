#!/usr/bin/env node
// Fail the build if a book the textbooks page will RENDER cannot actually be
// served or searched.
//
// Why this exists (2026-09-01). Publishing a book is a one-line flip upstream
// (`webBook:` in the textbooks repo's series-map overlay), and everything the
// site needs afterwards is a separate manual step in THIS repo: copy the PDF in,
// classify it in pdf-sources.js, rebuild books-index.json. Nothing checked that
// any of them had happened. check-book-topics.js guards the taxonomy, and
// sync-pdfs.js guards assets -> pdf-sources, but no check ran the other way, from
// the published set back to the files. So the two ways a publish half-lands were
// both silent:
//
//   - forget the PDF copy or mis-case its name, and /books renders a row whose
//     "Open book" link 404s. The build stayed green.
//   - forget the books-index.json rebuild, and the book is invisible to the
//     result search. The build stayed green, and nothing in this repo even READ
//     that file.
//
// CASE MATTERS, and this is why the check compares case-sensitively even though
// it usually runs on a case-insensitive macOS filesystem. GitHub Pages is
// case-sensitive: on 2026-09-01, EYNTKA-Probability.pdf served 200 and
// EYNTKA-probability.pdf served 404 for the same file. graph.json's `links.pdf`
// is the newest PDF found in the local book directory — a local-dev path, by
// design — so its casing tracks the .tex, not the published copy. Probability's
// two differ, and its /books link only resolved because book-descriptions.ts
// happened to carry a correctly-cased override in a file documented as being
// for DESCRIPTIONS ONLY. Deleting that "prose" entry would have broken the link.
//
// Runs from the `prebuild` hook via `npm run check`, so it gates `npm run build`
// and therefore CI. Needs no source tree — every input is committed here.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const graphPath = path.join(root, 'src', 'assets', 'series-map', 'graph.json');
const indexPath = path.join(root, 'src', 'assets', 'books-index.json');
const descPath = path.join(root, 'src', 'app', 'components', 'books', 'book-descriptions.ts');
const bookDir = path.join(root, 'src', 'assets', 'pdfs', 'books');

const { TRACKED, PINNED } = require('./pdf-sources');

const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

// Curated links, keyed by lower-cased basename exactly as CURATED_BY_PDF is.
// Regex over the source, the same approach check-book-topics.js takes to
// book-topics.ts: these are hand-authored object literals, not data files.
const descSource = fs.readFileSync(descPath, 'utf8');
const curatedLink = new Map();
for (const m of descSource.matchAll(/link:\s*'[^']*assets\/pdfs\/books\/([^']+)'/g)) {
  curatedLink.set(m[1].toLowerCase(), m[1]);
}

// The basename the page will actually request, resolved in BookCatalogService's
// order. `links.web` is built from the overlay's `webBook` value, which IS the
// published path, so it is authoritative; the other two are fallbacks for nodes
// that have no web link (i.e. books not on the shelf).
function renderedBasename(n) {
  const m = /[?&]src=([^&]+)/.exec(n.links?.web ?? '');
  if (m) return decodeURIComponent(m[1]).split('/').pop();
  const local = (n.links?.pdf ?? '').split('/').pop();
  return curatedLink.get(local.toLowerCase()) ?? local;
}

// Case-sensitive existence: readdir and compare, because fs.existsSync answers
// the local filesystem's question, not the web server's.
const onDisk = new Set(fs.readdirSync(bookDir).filter((f) => f.toLowerCase().endsWith('.pdf')));
const indexed = new Set(index.entries.map((e) => e.pdf));

const live = graph.nodes.filter((n) => n.webPublished && n.status !== 'planned');
const problems = [];

for (const n of live) {
  const base = renderedBasename(n);
  if (!base) {
    problems.push(`${n.id}: published but graph.json gives it no PDF link at all.`);
    continue;
  }
  if (!onDisk.has(base)) {
    const nearby = [...onDisk].find((f) => f.toLowerCase() === base.toLowerCase());
    problems.push(
      nearby
        ? `${n.id}: /books will request ${base}, but the file on disk is ${nearby}. ` +
          `GitHub Pages is case-sensitive, so this is a 404. Fix the casing in the ` +
          `overlay's webBook: entry upstream.`
        : `${n.id}: /books will request ${base}, which is not in assets/pdfs/books. ` +
          `Copy it in with \`npm run sync:pdfs\`.`,
    );
    continue;
  }
  const rel = `books/${base}`;
  if (!(rel in TRACKED) && !(rel in PINNED)) {
    problems.push(
      `${n.id}: ${rel} is served but unclassified. Add it to TRACKED in ` +
        `pdf-sources.js with its source path, or to PINNED with the reason it is frozen.`,
    );
  }
  if (!indexed.has(base)) {
    problems.push(
      `${n.id}: no entries in books-index.json, so the result search cannot see ` +
        `this book. Rebuild it: .eyntka/scripts/build-book-index.py > ` +
        `src/assets/books-index.json (from the textbooks repo).`,
    );
  }
}

// The reverse direction is deliberately not checked, for the same reason
// check-book-topics.js does not check it: assets and index entries legitimately
// outlive a book's time on the shelf (the password-gated raw list still reaches
// PDFs that no longer appear in webBook), so extras are normal, not a symptom.

if (problems.length) {
  console.error(
    `\ncheck-published-books: ${problems.length} problem(s) across ${live.length} published book(s):\n` +
      problems.map((p) => `  ${p}`).join('\n') +
      '\n',
  );
  process.exit(1);
}

console.log(
  `check-published-books: ${live.length} published book(s), all with a servable ` +
    `PDF (case-exact), a classified source, and search index entries.`,
);
