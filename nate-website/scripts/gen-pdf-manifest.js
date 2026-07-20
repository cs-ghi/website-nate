#!/usr/bin/env node
// Generate src/assets/pdfs/books/manifest.json — a sorted list of the book PDF
// filenames in that directory. The Books "raw PDFs" view fetches this static
// file (same-origin) instead of the GitHub contents API, so the site has no
// hardcoded repo owner and is not subject to the 60-req/hr unauthenticated API
// rate limit. Run automatically before `build`/`start` (npm pre* hooks); the
// generated manifest is committed so it is present even without a build.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'assets', 'pdfs', 'books');
const out = path.join(dir, 'manifest.json');

const pdfs = fs
  .readdirSync(dir)
  .filter((f) => f.toLowerCase().endsWith('.pdf'))
  .sort((a, b) => a.localeCompare(b));

fs.writeFileSync(out, JSON.stringify(pdfs, null, 2) + '\n');
console.log(`gen-pdf-manifest: ${pdfs.length} book PDF(s) -> ${path.relative(process.cwd(), out)}`);
