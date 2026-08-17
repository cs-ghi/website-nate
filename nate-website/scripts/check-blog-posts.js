#!/usr/bin/env node
// Fail the build if a live blog post points at a PDF that is not there.
//
// This exists because it already happened: "Comparing Schemes and Manifolds"
// shipped for months linking to differences_between_schemes_and_manifolds.pdf,
// which was never compiled into assets — the card rendered fine and the link
// 404'd. Nothing in an Angular build checks a string that only ever becomes a
// URL at runtime, so the check has to be here.
//
// Runs from the `prebuild` hook, so it gates `npm run build` and therefore CI.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const postsPath = path.join(root, 'src', 'app', 'components', 'blog', 'blog-posts.ts');
const pdfDir = path.join(root, 'src', 'assets', 'pdfs', 'blogs');

const source = fs.readFileSync(postsPath, 'utf8');

// blog-posts.ts is a hand-authored array of object literals. Strip comments
// first: unpublished posts live commented out in that file by design, and they
// are exactly the ones whose PDFs may legitimately be absent.
const live = source
  .replace(/\/\/.*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const links = [...live.matchAll(/link:\s*'([^']+)'/g)].map((m) => m[1]);
if (links.length === 0) {
  console.error(
    'check-blog-posts: parsed 0 posts out of blog-posts.ts. The file shape ' +
      'changed; update the matcher in this script.',
  );
  process.exit(1);
}

const topics = [...live.matchAll(/topic:\s*'([^']+)'/g)].map((m) => m[1]);
const known = new Set([...live.matchAll(/^\s*key:\s*'([^']+)'/gm)].map((m) => m[1]));

const onDisk = new Set(fs.readdirSync(pdfDir).filter((f) => f.toLowerCase().endsWith('.pdf')));
const missing = links.filter((l) => !onDisk.has(l.split('/').pop()));
const badTopics = [...new Set(topics.filter((t) => !known.has(t)))];

if (missing.length) {
  console.error(
    `\ncheck-blog-posts: ${missing.length} live post(s) link to a PDF that is not in ` +
      `${path.relative(root, pdfDir)}:\n` +
      missing.map((l) => `  ${l.split('/').pop()}`).join('\n') +
      '\nCompile the PDF into that directory, or comment the entry out.\n',
  );
  process.exit(1);
}

if (badTopics.length) {
  console.error(
    `\ncheck-blog-posts: ${badTopics.length} post(s) use a topic key that is not in ` +
      `BLOG_TOPICS: ${badTopics.join(', ')}\n`,
  );
  process.exit(1);
}

console.log(`check-blog-posts: ${links.length} live post(s), all with a PDF and a known topic.`);
