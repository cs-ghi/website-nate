# Blog redesign — the Stream

**Shipped 2026-08-22.** `/blog` is a typographic dated index with a two-tier
domain/topic taxonomy and a password-gated set of planned posts.

Prototype: `_prototypes/blog-redesign.html?v=stream` (`./_prototypes/serve.sh`).
The other three explored layouts stay in that file as templates for other pages;
see `_prototypes/README.md`.

## Why

`/blog` was a search box, two chip rows, a promoted lead card and a card grid —
structurally the same page as `/books`, `/notes` and `/programming`. Nothing
about it read as a blog, and faceted-search chrome is heavy for ten posts.

## The design (locked)

- No cards, no grid, no search box. One entry per row, separated by hairlines
  and broken by year.
- Serif titles at 25px. The page is typography-led; it is the only page on the
  site with no boxes on it.
- Left rail per entry: domain (mixed view only), date, level as a coloured word.
- Foot line per entry: topics, page count, reading estimate, hover arrow.
- Filtering is one quiet line of text, not chips.
- Posts still open as PDFs in `/pdf-viewer`. No LaTeX-to-HTML.

## Taxonomy (locked)

Non-maths writing is planned — AI, philosophy, quant — and both existing facets
break on it.

**Two tiers replace the flat topic row.** `domain` (Mathematics / AI /
Philosophy / Quant) on the top filter line; `topic` on a quieter second line
that appears only once a domain is selected, and only lists that domain's
topics. A flat row mixing "Algebra" with "Philosophy" compares a subfield to a
domain. Domains with no posts do not render.

**Level keeps one three-step ramp, with per-domain labels.** The ramp stays
shared so the green-to-amber colour coding and the ordering stay uniform across
the whole stream, but "Undergraduate" is a maths ladder and says nothing about a
philosophy essay:

| key | Mathematics | AI | Philosophy | Quant |
| --- | --- | --- | --- | --- |
| `open` | General audience | No background | General audience | General audience |
| `mid` | Undergraduate | Practitioner | Some philosophy | Some finance |
| `deep` | Graduate | Research-level | Specialist | Practitioner |

## Data changes

In `src/app/interfaces/blog.model.ts`:

- `BlogLevel` renamed `'general' | 'undergrad' | 'graduate'` →
  `'open' | 'mid' | 'deep'`. The old names are maths-specific and would be wrong
  the first time a philosophy post is added.
- `LEVEL_LABEL` becomes `Record<BlogDomain, Record<BlogLevel, string>>`, with a
  short-form twin for the rail.
- `BlogEntry` gains `domain: BlogDomain` and `planned?: true`, and `link`
  becomes optional. `planned` controls visibility only and says nothing about
  whether a PDF exists. Every one of the ten published posts is `'maths'`.
- New `BlogDomain` list in `blog-posts.ts` alongside `BLOG_TOPICS`, each domain
  owning its topic keys. The existing five maths topics move under `maths`
  unchanged.

In `scripts/check-blog-posts.js`, which already validates topic keys: also
validate that each post's `domain` is known and that its `topic` belongs to
that domain. A maths topic on a philosophy post is exactly the error this
taxonomy invites, and it is a two-line check.

## Planned posts, behind a lock (locked)

`planned: true` entries are posts that are written-but-uncompiled or merely
intended. They are **hidden from visitors** and revealed by an unlock at the
bottom of the page, mirroring the admin lock already on `/books`:
SHA-256 hash compared client-side, unlock held in `sessionStorage`, lock icon
bottom-right with a small password overlay above it.

- Password: `blogpdf` → `57a0af3b7fdd6aa6f0e3e9b4c3f2d37cdc11b0087f22d4dd8071869da5724935`
- `sessionStorage` key: `blog_planned_auth`
- Reuse `books.component.scss`'s `.lock-button` / `.password-overlay` rules
  verbatim so the two locks look and behave identically.

When unlocked, a planned entry renders in its chronological position — dimmed
and italic, with a dotted "planned" tag and "Not yet written" where the read
arrow would be.

**Everything derived must come off the visible set, not the full set.** Domain
counts, which domain chips render, which topic chips render, and the year
headings all have to be computed after the planned filter. Otherwise a locked
visitor sees a "Philosophy" chip that yields nothing, which advertises precisely
what the lock is hiding.

This replaces the old convention in `blog-posts.ts`, where unpublished entries
lived commented out because `check-blog-posts.js` refused a live entry with no
PDF. The check now allows a planned entry to omit `link` — but if it has one,
the PDF must still exist, so unlocking can never surface a broken read link. A
planned entry without a link needs `intendedDate` instead, or it sorts to the
bottom rather than into the stream.

Worth being clear about what this is: a client-side gate. The hash and the
planned entries' titles and descriptions are both in the shipped JS bundle, so
this hides drafts from a casual visitor, not from anyone who opens devtools.
That is the same guarantee `/books` already offers, and it is the right level
for "don't show my unfinished list".

## What shipped

- `blog.model.ts` — `BlogDomain`, levels renamed `open`/`mid`/`deep`,
  `LEVEL_LABEL` and `LEVEL_SHORT` keyed by domain, `planned` + optional `link`.
- `blog-posts.ts` — `BLOG_DOMAINS` with domain-owned topics; `TOPIC_DOMAIN` for
  the build check. 10 published posts, all `maths`.
- `blog.component.{ts,html,scss}` — the Stream. Year grouping is computed in the
  component (once per filter change) rather than by a template pipe. The sort
  control and `fuzzyScore` search are gone; `utils/fuzzy-score.ts` itself stays,
  since `books.component.ts` and `book-index.service.ts` still use it.
- `blog-catalog.service.ts` — merges the PDF manifest, falls back to
  `intendedDate` for link-less planned entries, and leaves planned filtering to
  the component, where the unlock state lives.
- `check-blog-posts.js` — rewritten for domains, in-domain topics, and planned
  entries. Verified against injected failures in both directions.
- `gen-blog-manifest.js` → `gen-pdf-facts.js`, now taking a directory argument
  so `/papers` reuses it. `package.json` calls it once per directory.

### Six planned entries, not four

The four entries that used to sit commented out at the bottom of
`blog-posts.ts` are now planned entries, plus the two philosophy drafts. Three
of the four already had compiled PDFs on disk
(`alien_perspective_on_analysis`, `Conjecture_old`, `From_Quadratic_to_Langland`)
and are therefore readable once unlocked; only `Comparing Schemes and Manifolds`
has no PDF. That is why `planned` gates visibility rather than implying "no
PDF" — collapsing the two would have thrown away three readable documents.

## Not doing

- Search. Ten to twenty entries on one page do not need it, and the command
  palette already exists for cross-site lookup.
- The "Latest" lead card. In a dated index the top row is self-evidently the
  latest.
- LaTeX-to-HTML rendering (see `project-isomorphism-shelved`).
