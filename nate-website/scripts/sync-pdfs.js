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
for (const rel of [...Object.keys(TRACKED), ...Object.keys(PINNED)]) {
  if (!known.has(rel)) errors.push(`${rel}: listed in pdf-sources.js but not on disk`);
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

const stale = [];
const missing = [];

for (const [rel, srcRel] of Object.entries(TRACKED)) {
  const src = path.join(SOURCE_ROOT, srcRel);
  if (!fs.existsSync(src)) {
    missing.push(`${rel}: source ${srcRel} is gone. Repoint it, or move the entry to PINNED.`);
    continue;
  }
  const dst = path.join(assetRoot, rel);
  if (sha1(src) !== sha1(dst)) stale.push({ rel, src, dst, srcRel });
}

if (missing.length) {
  console.error(`\nsync-pdfs: ${missing.length} missing source(s):`);
  for (const m of missing) console.error(`  ${m}`);
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
  const building = require('child_process')
    .spawnSync('pgrep', ['-x', 'pdflatex,xelatex,lualatex,luahbtex,pdftex'], { encoding: 'utf8' })
    .stdout.trim();
  if (building) {
    console.error(
      `\nsync-pdfs: a LaTeX build is running (${building.split('\n').length} process(es)). ` +
        `Refusing to copy — the PDFs are mid-write. Re-run when it finishes.\n`,
    );
    process.exit(1);
  }

  for (const { rel, src, dst } of stale) {
    fs.copyFileSync(src, dst);
    console.log(`sync-pdfs: updated ${rel}`);
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
