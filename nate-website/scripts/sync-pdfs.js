#!/usr/bin/env node
// Keep src/assets/pdfs in step with the LaTeX tree it is copied from, and fail
// the build when it is not.
//
//   node scripts/sync-pdfs.js           report; exit 1 if anything is behind
//   node scripts/sync-pdfs.js --write   copy the current sources over the copies
//
// Two independent checks, because they fail in different places:
//
//   1. CLASSIFICATION — every PDF in assets/pdfs appears in TRACKED or PINNED
//      in pdf-sources.js, and every entry there is on disk. Needs no source
//      tree, so it runs everywhere including CI. This is the check that keeps
//      the map honest: a PDF added to assets without a line in the map is an
//      error, so no file can quietly opt out of the freshness check below.
//
//   2. FRESHNESS — every TRACKED copy is byte-identical to its source. Needs
//      SOURCE_ROOT, which is a path in the author's home directory and does not
//      exist on a GitHub runner. Skipped there. Enforcement is therefore local:
//      the build you run before pushing is the one that catches staleness.
//
// Runs from the `prebuild` hook via `npm run check`, so it gates `npm run build`.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

const { SOURCE_ROOT, TRACKED, PINNED } = require('./pdf-sources');

const write = process.argv.includes('--write');
const root = path.join(__dirname, '..');
const assetRoot = path.join(root, 'src', 'assets', 'pdfs');
const DIRS = ['blogs', 'books', 'notes', 'papers'];

const sha1 = (p) => crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex');

const onDisk = DIRS.flatMap((d) =>
  fs
    .readdirSync(path.join(assetRoot, d))
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .map((f) => `${d}/${f}`),
).sort();

const errors = [];

// --- 1. classification ------------------------------------------------------
for (const rel of onDisk) {
  const inTracked = rel in TRACKED;
  const inPinned = rel in PINNED;
  if (inTracked && inPinned) errors.push(`${rel}: in both TRACKED and PINNED; pick one`);
  else if (!inTracked && !inPinned) {
    errors.push(
      `${rel}: not in pdf-sources.js. Add it to TRACKED with its source path, ` +
        `or to PINNED with the reason it is frozen.`,
    );
  }
}
const known = new Set(onDisk);
for (const rel of Object.keys(PINNED)) {
  if (!known.has(rel)) errors.push(`${rel}: pinned in pdf-sources.js but not on disk`);
}
// A TRACKED entry with no copy yet is how a new PDF enters the site, so under
// --write it is a file to create rather than an error; the freshness pass copies
// it, and reports separately if the source is the thing that is missing. Without
// --write it stays an error, because then the site is short a PDF it claims to
// serve. Adding a blog on 2026-08-23 showed this had been backwards: the
// classification pass exited first, so --write could never create the file it
// was being asked to add, even though the reporting below has a '(new)' case.
for (const rel of Object.keys(TRACKED)) {
  if (!known.has(rel) && !write) {
    errors.push(
      `${rel}: listed in pdf-sources.js but not on disk. Run \`npm run sync:pdfs\` to create it.`,
    );
  }
}

if (errors.length) {
  console.error(`\nsync-pdfs: ${errors.length} classification problem(s):`);
  for (const e of errors) console.error(`  ${e}`);
  console.error('');
  process.exit(1);
}

const pinned = Object.keys(PINNED).length;
const tracked = Object.keys(TRACKED).length;

// --- 2. freshness -----------------------------------------------------------
if (!fs.existsSync(SOURCE_ROOT)) {
  console.log(
    `sync-pdfs: ${tracked} tracked + ${pinned} pinned PDF(s), all classified. ` +
      `Freshness skipped: no ${SOURCE_ROOT} (expected on CI).`,
  );
  process.exit(0);
}

// A killed latexmk leaves a truncated PDF behind: the file exists, is newer than
// the site copy, and is structurally empty. The running-build guard below cannot
// see it, because the build is already dead. Hit on 2026-08-22, when
// EYNTKA_algGeo.pdf was left at 510KB / 0 pages against a good 4MB site copy and
// the sync would happily have shipped it. So: refuse to treat a source with no
// readable page tree as a sync candidate. Same extraction as gen-pdf-facts.js --
// LaTeX writes /Count into a Flate-compressed object stream.
function pageCount(file) {
  const buf = fs.readFileSync(file);
  const text = buf.toString('latin1');
  const scan = (s) => {
    let best = 0;
    for (const m of s.matchAll(/\/Type\s*\/Pages[\s\S]{0,600}?\/Count\s+(\d+)/g)) {
      best = Math.max(best, +m[1]);
    }
    return best;
  };
  let best = scan(text);
  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const start = m.index + m[0].length;
    const end = text.indexOf('endstream', start);
    if (end < 0) continue;
    try {
      best = Math.max(best, scan(zlib.inflateSync(buf.subarray(start, end)).toString('latin1')));
    } catch {
      /* not a Flate stream */
    }
  }
  return best;
}

const stale = [];
const missing = [];
const corrupt = [];

for (const [rel, srcRel] of Object.entries(TRACKED)) {
  const src = path.join(SOURCE_ROOT, srcRel);
  if (!fs.existsSync(src)) {
    missing.push(`${rel}: source ${srcRel} is gone. Repoint it, or move the entry to PINNED.`);
    continue;
  }
  const dst = path.join(assetRoot, rel);
  if (fs.existsSync(dst) && sha1(src) === sha1(dst)) continue;
  const srcPages = pageCount(src);
  if (!srcPages) {
    corrupt.push(
      `${rel}: source has no readable page tree (${(fs.statSync(src).size / 1024) | 0}KB). ` +
        `Looks like an interrupted build -- recompile ${srcRel} before syncing.`,
    );
    continue;
  }
  // Measure the outgoing copy BEFORE it is overwritten, so --write can report
  // what actually changed. This is the sanity check that a wrong version has
  // not been shipped: a book that loses a third of its pages is far more
  // visible as "879 -> 512 pp" than as a filename in a list.
  const had = fs.existsSync(dst);
  stale.push({
    rel,
    src,
    dst,
    srcRel,
    srcPages,
    dstPages: had ? pageCount(dst) : 0,
    srcSize: fs.statSync(src).size,
    dstSize: had ? fs.statSync(dst).size : 0,
  });
}

if (missing.length || corrupt.length) {
  for (const m of missing) console.error(`sync-pdfs: ${m}`);
  for (const c of corrupt) console.error(`sync-pdfs: ${c}`);
  console.error('');
  process.exit(1);
}

if (!stale.length) {
  console.log(
    `sync-pdfs: ${tracked} tracked PDF(s) match their source, ${pinned} pinned by design.`,
  );
  process.exit(0);
}

if (write) {
  // latexmk writes the PDF in place, so copying while a build is running can
  // pick up a truncated file. Hit within minutes of writing this script: a
  // series-wide recompile was in flight and two books re-drifted between the
  // sync and the check that followed it.
  // Match the engine by process NAME, not with `pgrep -f`. The latter searches
  // whole command lines, so any shell whose command merely mentions latexmk --
  // including `... && npm run sync:pdfs` typed after a pgrep -- counts as a
  // build in flight and the sync refuses for no reason. The engine is also the
  // right thing to watch: latexmk orchestrates, but pdflatex writes the PDF.
  // The list must be a regex alternation: pgrep takes an extended regex, so a
  // comma-separated string matches only a process literally named
  // "pdflatex,xelatex,...", i.e. nothing. This guard silently never fired until
  // 2026-08-23, when the corruption check below caught a mid-write PDF that
  // this was supposed to have stopped first.
  const building = require('child_process')
    .spawnSync('pgrep', ['-x', 'pdflatex|xelatex|lualatex|luahbtex|pdftex'], { encoding: 'utf8' })
    .stdout.trim();
  if (building) {
    console.error(
      `\nsync-pdfs: a LaTeX build is running (${building.split('\n').length} process(es)). ` +
        `Refusing to copy — the PDFs are mid-write. Re-run when it finishes.\n`,
    );
    process.exit(1);
  }

  // Report what each copy changed. A shrink of more than a fifth in either
  // pages or bytes gets flagged: that is what shipping the wrong build looks
  // like, and it is worth a second glance even when it is intentional.
  const SHRINK = 0.2;
  const mb = (n) => (n / 1048576).toFixed(2) + 'MB';
  const width = Math.max(...stale.map((e) => e.rel.length));
  const suspect = [];

  for (const e of stale) {
    fs.copyFileSync(e.src, e.dst);
    const pageDrop = e.dstPages && (e.dstPages - e.srcPages) / e.dstPages;
    const sizeDrop = e.dstSize && (e.dstSize - e.srcSize) / e.dstSize;
    const odd = pageDrop > SHRINK || sizeDrop > SHRINK;
    if (odd) suspect.push(e.rel);
    const was = e.dstPages
      ? `${e.dstPages}pp ${mb(e.dstSize)}`
      : e.dstSize
        ? `unreadable ${mb(e.dstSize)}`
        : '(new)';
    const now = `${e.srcPages}pp ${mb(e.srcSize)}`;
    const delta = e.dstPages ? ` ${e.srcPages - e.dstPages >= 0 ? '+' : ''}${e.srcPages - e.dstPages}pp` : '';
    console.log(
      `sync-pdfs: ${e.rel.padEnd(width)}  ${was.padStart(16)} -> ${now.padEnd(16)}${delta}${odd ? '   <-- SHRANK, CHECK THIS' : ''}`,
    );
  }

  if (suspect.length) {
    console.log(
      `\nsync-pdfs: ${suspect.length} file(s) lost more than ${SHRINK * 100}% of their pages or bytes: ` +
        `${suspect.join(', ')}.\n           If that was not intended, the source may be a stale or partial build.`,
    );
  }
  console.log(
    `sync-pdfs: copied ${stale.length} PDF(s) from ${SOURCE_ROOT}. ` +
      `Re-run \`npm run gen\` if the page counts or dates changed.`,
  );
  process.exit(0);
}

const age = (p) => fs.statSync(p).mtime.toISOString().slice(0, 10);
console.error(`\nsync-pdfs: ${stale.length} site PDF(s) behind their source:`);
for (const { rel, src, dst, srcRel } of stale) {
  console.error(`  ${rel}  (site ${age(dst)}, source ${age(src)})`);
  console.error(`    <- ${srcRel}`);
}
console.error(`\n  Fix with: npm run sync:pdfs\n`);
process.exit(1);
