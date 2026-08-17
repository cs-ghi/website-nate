#!/usr/bin/env node
// Generate src/assets/pdfs/blogs/manifest.json — per-post page count and compile
// date for every blog PDF, keyed by filename.
//
// The blog page shows "Updated <month year> · N pp · ~M min" on each card. Those
// three facts are properties of the PDF, not editorial metadata, so they are
// read out of the file rather than hand-maintained in blog-posts.ts: recompiling
// a post and dropping the new PDF in is enough to move it back to the top of the
// feed. Both values come from the raw bytes with no external dependency —
// LaTeX writes /CreationDate into an uncompressed Info dictionary, and the page
// tree's /Count lives in a Flate-compressed object stream that zlib can inflate.
//
// Run automatically before `build`/`start` (npm pre* hooks); the generated
// manifest is committed so it is present even without a build.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const dir = path.join(__dirname, '..', 'src', 'assets', 'pdfs', 'blogs');
const out = path.join(dir, 'manifest.json');

// A dense LaTeX page is not a web page; this is the multiplier that turns a page
// count into the "~M min" estimate on the card.
const MINUTES_PER_PAGE = 2.5;

// The page tree root: /Type /Pages with the total in /Count. Nested /Pages nodes
// carry partial counts, so callers take the maximum. The key/value order is not
// fixed by the spec, hence both directions.
const PAGES_FORWARD = /\/Type\s*\/Pages[\s\S]{0,600}?\/Count\s+(\d+)/g;
const PAGES_REVERSE = /\/Count\s+(\d+)[\s\S]{0,600}?\/Type\s*\/Pages/g;

function scanCounts(text) {
  const hits = [
    ...[...text.matchAll(PAGES_FORWARD)].map((m) => +m[1]),
    ...[...text.matchAll(PAGES_REVERSE)].map((m) => +m[1]),
  ];
  return hits.length ? Math.max(...hits) : 0;
}

// Walk every `stream ... endstream` span, inflating the ones that are Flate.
// Anything that fails to inflate is an image or a font — skip it rather than
// trying to read the stream dictionary to find out.
function pageCount(buf) {
  const text = buf.toString('latin1');
  let best = scanCounts(text);

  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const start = m.index + m[0].length;
    const end = text.indexOf('endstream', start);
    if (end < 0) continue;
    try {
      best = Math.max(best, scanCounts(zlib.inflateSync(buf.subarray(start, end)).toString('latin1')));
    } catch {
      /* not a Flate stream */
    }
  }
  return best;
}

// PDF date strings are D:YYYYMMDDHHmmSS±HH'mm'. Only the day matters here.
function compiledOn(buf) {
  const text = buf.toString('latin1');
  const m =
    text.match(/\/CreationDate\s*\(D:(\d{4})(\d{2})(\d{2})/) ??
    text.match(/\/ModDate\s*\(D:(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

const manifest = {};
const skipped = [];

for (const file of fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.pdf')).sort()) {
  const buf = fs.readFileSync(path.join(dir, file));
  const pages = pageCount(buf);
  const updated = compiledOn(buf);
  if (!pages || !updated) skipped.push(file);
  manifest[file] = {
    pages: pages || null,
    updated,
    readingMinutes: pages ? Math.round(pages * MINUTES_PER_PAGE) : null,
  };
}

fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');

const n = Object.keys(manifest).length;
console.log(`gen-blog-manifest: ${n} blog PDF(s) -> ${path.relative(process.cwd(), out)}`);
if (skipped.length) {
  // Not fatal: the card degrades to no date / no length rather than not rendering.
  console.warn(
    `gen-blog-manifest: could not read page count or date from ${skipped.length} file(s): ` +
      skipped.join(', '),
  );
}
