#!/usr/bin/env node
// Fail the build if a blog post is inconsistent with what is on disk.
//
// This exists because it already happened: "Comparing Schemes and Manifolds"
// shipped for months linking to differences_between_schemes_and_manifolds.pdf,
// which was never compiled into assets — the card rendered fine and the link
// 404'd. Nothing in an Angular build checks a string that only ever becomes a
// URL at runtime, so the check has to be here.
//
// Checks:
//   1. every published post has a `link`, and that PDF is on disk;
//   2. a `planned` post may omit `link`, but if it has one the PDF must exist —
//      unlocking the page must never surface a broken link;
//   3. a `planned` post with no `link` has an `intendedDate`, or it sorts to the
//      bottom of the stream instead of into it;
//   4. every post with a PDF has a `published` date, since that is what orders
//      the stream. Nothing on disk can supply it — the PDF only records when it
//      was last compiled, and a rebuild overwrites that — so an entry added
//      without one would silently sink to the bottom;
//   5. every `topic` and `alsoTopics` key belongs to that post's own `domain`.
//      The two-tier taxonomy makes a maths topic on a philosophy post easy to
//      write and impossible to see.
//
// Runs from the `prebuild` hook, so it gates `npm run build` and therefore CI.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const postsPath = path.join(root, 'src', 'app', 'components', 'blog', 'blog-posts.ts');
const pdfDir = path.join(root, 'src', 'assets', 'pdfs', 'blogs');

const source = fs.readFileSync(postsPath, 'utf8');

// Strip comments before parsing so commented-out examples in this file's own
// prose cannot be mistaken for entries.
const live = source
  .replace(/\/\/.*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

// The domain metadata comes first in the file and the post array second. Split
// on the array declaration so topic keys declared in BLOG_DOMAINS are not
// mistaken for post fields.
const splitAt = live.indexOf('BLOG_POSTS');
if (splitAt < 0) {
  console.error('check-blog-posts: no BLOG_POSTS array found. The file shape changed.');
  process.exit(1);
}
const taxonomySrc = live.slice(0, splitAt);
const postsSrc = live.slice(splitAt);

// Which topic keys each domain owns, read straight out of BLOG_DOMAINS. Matches
// a domain's `key` / `label` / `topics: [...]` triple and pulls every `key`
// inside the topics array. Relies on the file's formatting, which is why a zero
// match below is a hard error rather than a silent pass.
const domains = Object.fromEntries(
  [
    ...taxonomySrc.matchAll(
      /key:\s*'([^']+)'\s*,\s*\n\s*label:\s*'[^']*'\s*,\s*\n\s*topics:\s*\[([\s\S]*?)\n\s*\]/g,
    ),
  ].map(([, domain, body]) => [domain, [...body.matchAll(/key:\s*'([^']+)'/g)].map((m) => m[1])]),
);

if (!Object.keys(domains).length) {
  console.error(
    'check-blog-posts: parsed 0 domains out of BLOG_DOMAINS. The file shape ' +
      'changed; update the matcher in this script.',
  );
  process.exit(1);
}

// One object literal per post. Splitting on `\n  {` matches the file's
// formatting: top-level array members are indented two spaces.
const entries = postsSrc
  .split(/\n\s{2}\{/)
  .slice(1)
  .map((chunk) => chunk.split(/\n\s{2}\},?/)[0]);

if (!entries.length) {
  console.error(
    'check-blog-posts: parsed 0 posts out of blog-posts.ts. The file shape ' +
      'changed; update the matcher in this script.',
  );
  process.exit(1);
}

// Accepts either quote style: an entry whose value contains an apostrophe is
// written with double quotes, and two of them are. Matching only `'...'` left
// those reading as unnamed in every error message this script can emit.
const field = (chunk, name) =>
  chunk.match(new RegExp(`${name}:\\s*'([^']*)'`))?.[1] ??
  chunk.match(new RegExp(`${name}:\\s*"([^"]*)"`))?.[1];
const list = (chunk, name) => {
  const raw = chunk.match(new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? '';
  return [...raw.matchAll(/'([^']+)'/g)].map((m) => m[1]);
};

const onDisk = new Set(fs.readdirSync(pdfDir).filter((f) => f.toLowerCase().endsWith('.pdf')));
const errors = [];
let published = 0;
let planned = 0;

for (const chunk of entries) {
  const name = field(chunk, 'name') ?? '(unnamed)';
  const link = field(chunk, 'link');
  const domain = field(chunk, 'domain');
  const topic = field(chunk, 'topic');
  const isPlanned = /planned:\s*true/.test(chunk);
  isPlanned ? planned++ : published++;

  if (!domain || !(domain in domains)) {
    errors.push(`${name}: domain '${domain}' is not in BLOG_DOMAINS`);
    continue;
  }

  for (const t of [topic, ...list(chunk, 'alsoTopics')]) {
    if (!t) {
      errors.push(`${name}: no topic`);
    } else if (!domains[domain].includes(t)) {
      errors.push(`${name}: topic '${t}' does not belong to domain '${domain}'`);
    }
  }

  const pub = field(chunk, 'published');
  if (pub && !/^\d{4}-\d{2}-\d{2}$/.test(pub)) {
    errors.push(`${name}: published '${pub}' is not an ISO yyyy-mm-dd date`);
  }

  if (link) {
    if (!onDisk.has(link.split('/').pop())) {
      errors.push(`${name}: links to ${link.split('/').pop()}, which is not in assets/pdfs/blogs`);
    }
    if (!pub) {
      errors.push(
        `${name}: has a PDF but no 'published' date, so it would sort to the bottom. ` +
          `Use the earliest /CreationDate for its PDF in git if the date is not remembered.`,
      );
    }
  } else if (!isPlanned) {
    errors.push(`${name}: published posts need a link`);
  } else if (!field(chunk, 'intendedDate')) {
    errors.push(`${name}: planned with no link needs an intendedDate to sort into the stream`);
  }
}

if (errors.length) {
  console.error(`\ncheck-blog-posts: ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ${e}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-blog-posts: ${published} published + ${planned} planned post(s), ` +
    `all with a known domain, an in-domain topic, and a PDF where one is claimed.`,
);
