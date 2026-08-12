#!/usr/bin/env node
// Fail the build if the textbooks page's subject taxonomy has drifted from the
// book catalogue.
//
// graph.json is synced in from the textbooks repo (`npm run sync:web` there), so
// publishing a book is a one-line flip upstream with no change in this repo.
// That is the point — and also the hazard: without this check, a newly published
// book would land on /books with no subject and silently re-create the "Other
// Topics" junk drawer that the topic taxonomy exists to abolish.
//
// Runs from the `prebuild` hook, so it gates `npm run build` and therefore CI.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const graphPath = path.join(root, 'src', 'assets', 'series-map', 'graph.json');
const topicsPath = path.join(root, 'src', 'app', 'components', 'books', 'book-topics.ts');

const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
const source = fs.readFileSync(topicsPath, 'utf8');

// book-topics.ts is a hand-authored object literal keyed by graph node id, so
// the assignments are exactly the `NateXxx:` keys. Comments mention ids too, so
// require the colon — a book named only in prose does not count as assigned.
const assigned = new Set(
  [...source.matchAll(/^\s*(Nate[A-Za-z0-9]+)\s*:/gm)].map((m) => m[1]),
);
if (assigned.size === 0) {
  console.error(
    'check-book-topics: parsed 0 assignments out of book-topics.ts. The file ' +
      'shape changed; update the matcher in this script.',
  );
  process.exit(1);
}

const live = graph.nodes.filter((n) => n.webPublished && n.status !== 'planned');
const missing = live.filter((n) => !assigned.has(n.id));

// The reverse direction is not checked. Assignments outnumber published books
// on purpose: they pre-empt a future publish, and the deployed graph.json omits
// books the overlay's `web.hide` block keeps off the public map entirely, so an
// id being absent here is the normal case rather than a symptom of a rename.
const known = new Set(graph.nodes.map((n) => n.id));
const held = [...assigned].filter((id) => !known.has(id)).length;

if (missing.length) {
  console.error(
    `\ncheck-book-topics: ${missing.length} published book(s) have no subject topic.\n` +
      `Add them to ${path.relative(root, topicsPath)} (BOOK_TOPICS):\n` +
      missing.map((n) => `  ${n.id.padEnd(30)} ${n.title}`).join('\n') +
      '\n',
  );
  process.exit(1);
}

console.log(
  `check-book-topics: ${live.length} published book(s), all assigned a subject ` +
    `topic; ${held} assignment(s) held for unpublished books.`,
);
