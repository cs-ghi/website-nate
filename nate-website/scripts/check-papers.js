#!/usr/bin/env node
// Fail the build if a paper record is inconsistent, in the spirit of
// check-blog-posts.js — which exists because a blog card shipped for months
// pointing at a PDF that was never compiled.
//
// Checks:
//   1. every `versions[].file` is on disk in assets/pdfs/papers;
//   2. slugs are unique and URL-safe;
//   3. every paper has a non-empty abstract;
//   4. arXiv ids look like arXiv ids;
//   5. `status: 'published'` implies a venue DOI;
//   6. every $…$ / $$…$$ span in every abstract parses under KaTeX.
//
// (6) is the one worth the dependency. KaTeX renders a parse error as a red
// span at runtime rather than throwing, so without a build gate a typo in an
// abstract ships silently. Here it is a failed CI run instead.
//
// Runs from the `prebuild` hook, so it gates `npm run build` and therefore CI.
const fs = require('fs');
const path = require('path');
const katex = require('katex');

const root = path.join(__dirname, '..');
const papersPath = path.join(root, 'src', 'app', 'components', 'papers', 'papers.ts');
const pdfDir = path.join(root, 'src', 'assets', 'pdfs', 'papers');

const source = fs.readFileSync(papersPath, 'utf8');

// Only the PAPERS array; LEGACY_PDF_REDIRECTS below it also contains quoted
// filenames and would otherwise be scanned as if it were an entry.
const start = source.indexOf('export const PAPERS');
const end = source.indexOf('export const LEGACY_PDF_REDIRECTS');
if (start < 0) {
  console.error('check-papers: no PAPERS array found. The file shape changed.');
  process.exit(1);
}
const body = (end > start ? source.slice(start, end) : source.slice(start))
  .replace(/^\s*\/\/.*$/gm, '');

// One chunk per paper: top-level array members are indented two spaces.
const entries = body
  .split(/\n\s{2}\{/)
  .slice(1)
  .map((chunk) => chunk.split(/\n\s{2}\},?/)[0]);

if (!entries.length) {
  console.error(
    'check-papers: parsed 0 papers out of papers.ts. The file shape changed; ' +
      'update the matcher in this script.',
  );
  process.exit(1);
}

const field = (chunk, name) => chunk.match(new RegExp(`\\b${name}:\\s*'((?:[^'\\\\]|\\\\.)*)'`))?.[1];

// Abstracts are written as adjacent single-quoted string literals joined by +.
// Concatenate them back so the math spans are not split mid-expression.
function abstractOf(chunk) {
  const at = chunk.search(/\babstract:\s*/);
  if (at < 0) return '';
  const tail = chunk.slice(at);
  const stop = tail.search(/\n\s{4}[a-zA-Z]+:/);
  const region = stop > 0 ? tail.slice(0, stop) : tail;
  return [...region.matchAll(/'((?:[^'\\]|\\.)*)'/g)]
    .map((m) => m[1])
    .join('')
    .replace(/\\\\/g, '\\')
    .replace(/\\'/g, "'");
}

const MATH = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
const ARXIV_ID = /^\d{4}\.\d{4,5}(v\d+)?$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const onDisk = new Set(fs.readdirSync(pdfDir).filter((f) => f.toLowerCase().endsWith('.pdf')));
const errors = [];
const slugs = new Set();
let spans = 0;

for (const chunk of entries) {
  const slug = field(chunk, 'slug') ?? '(no slug)';
  const label = field(chunk, 'title') ?? slug;

  if (!SLUG.test(slug)) errors.push(`${label}: slug '${slug}' is not lowercase-kebab`);
  if (slugs.has(slug)) errors.push(`${label}: duplicate slug '${slug}'`);
  slugs.add(slug);

  const files = [...chunk.matchAll(/file:\s*'([^']+)'/g)].map((m) => m[1]);
  if (!files.length) errors.push(`${label}: no versions`);
  for (const f of files) {
    if (!onDisk.has(f)) errors.push(`${label}: version file ${f} is not in assets/pdfs/papers`);
  }

  const abstract = abstractOf(chunk);
  if (!abstract.trim()) {
    errors.push(`${label}: empty abstract`);
  } else {
    for (const m of abstract.matchAll(MATH)) {
      const tex = m[1] ?? m[2];
      spans++;
      try {
        katex.renderToString(tex, { throwOnError: true, displayMode: m[1] !== undefined });
      } catch (e) {
        errors.push(`${label}: KaTeX cannot parse "${tex}" — ${e.message.split('\n')[0]}`);
      }
    }
  }

  for (const m of chunk.matchAll(/host:\s*'arxiv'[\s\S]{0,120}?id:\s*'([^']+)'/g)) {
    if (!ARXIV_ID.test(m[1])) errors.push(`${label}: '${m[1]}' is not a valid arXiv id`);
  }

  if (field(chunk, 'status') === 'published' && !/doi:\s*'/.test(chunk)) {
    errors.push(`${label}: status is 'published' but there is no venue DOI`);
  }
}

if (errors.length) {
  console.error(`\ncheck-papers: ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ${e}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-papers: ${entries.length} paper(s), all with a PDF on disk, a unique slug, ` +
    `and ${spans} math span(s) that KaTeX parses.`,
);
