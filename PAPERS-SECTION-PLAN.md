# Papers section

**Phase 1 shipped 2026-08-22.** `/papers` and `/papers/:slug` are live with both
seed papers, KaTeX abstracts, generated BibTeX, and build-gating checks. arXiv is
a first-class but *optional* attribute throughout: posting a paper is a
`postings` edit, not a redesign. Phases 2–4 below are outstanding.

## Goal

`/notes` currently carries three different kinds of document under one heading:
research output (`twisted-IHC.pdf`, `HRR.pdf`), expository notes (Galois
cohomology, toric varieties, Hodge, preliminary chapter), and a translation
(Serre). A reader landing there cannot tell which is which, and there is nowhere
to put the things a paper needs — abstract, authors, arXiv identifier, version
history, a citation block.

`/papers` is that place. Everything below is designed so posting a paper to arXiv
is a one-field edit plus a build, not a redesign.

## Scope (locked)

- **The two research documents move out of `/notes`.** `/notes` keeps its
  expository identity; `/papers` is the canonical home for research.
- `/blog` is unaffected — short-form intuition stays where it is.
- Seed contents: **Integral Hodge Conjecture — Invariance Under Twisting** and
  **Hirzebruch–Riemann–Roch Theorem**.

```
/papers  -> research output, arXiv-bound
/notes   -> expository notes + translations
/blog    -> short-form intuition
```

## Data model

New `src/app/interfaces/papers.model.ts`. Follows the shape already established
by `programming.model.ts` (authored TS array) plus the manifest-merge pattern
from `blog.model.ts` (PDF facts read off the file, never hand-typed).

```ts
export type PaperStatus =
  | 'draft'       // written, on-site, not yet posted anywhere
  | 'preprint'    // on arXiv, not submitted
  | 'submitted'   // under review at a venue
  | 'accepted'    // accepted, not yet in print
  | 'published';  // has a DOI

export type PaperKind = 'research' | 'thesis' | 'survey';

// A public posting of the paper. arXiv is one publisher among several so that
// an HAL/Zenodo/institutional-repository entry is not a special case.
export interface PaperPosting {
  host: 'arxiv' | 'zenodo' | 'hal' | 'tspace' | 'other';
  id: string;            // '2604.01234' for arXiv; a handle/DOI suffix elsewhere
  url?: string;          // derived for known hosts, explicit for 'other'
  primaryClass?: string; // arXiv primary category, e.g. 'math.AG'
  crossLists?: string[]; // e.g. ['math.AT', 'math.KT']
  announced?: string;    // ISO date of v1 announcement
}

// arXiv is versioned; the site must be able to say which version it is serving.
export interface PaperVersion {
  label: string;   // 'v1', 'v2', 'submitted', 'final'
  date: string;    // ISO
  file: string;    // assets/pdfs/papers/<...>.pdf
  note?: string;   // 'referee revisions', 'typos'
}

export interface PaperVenue {
  name: string;    // journal or proceedings
  volume?: string;
  pages?: string;
  year?: number;
  doi?: string;
}

export interface PaperEntry {
  slug: string;             // /papers/:slug
  title: string;
  authors: string[];        // ordered; single-author today, list-ready
  kind: PaperKind;
  status: PaperStatus;
  abstract: string;         // plain text, authored here
  summary?: string;         // one-line, plain-language, for the card
  msc?: string[];           // MSC 2020 classes, e.g. ['14C30', '19L50']
  keywords?: string[];
  topics: string[];         // reuse the /blog + /textbooks topic vocabulary
  versions: PaperVersion[]; // newest last; the site serves the last entry
  postings?: PaperPosting[];
  venue?: PaperVenue;
  code?: string;            // repo of supporting computations, if any
  relatedNotes?: string[];  // links into /notes, /blog, /books
  bibtexKey?: string;       // defaults to <lastname><year><slugword>
}
```

Rendered type `Paper extends PaperEntry` adds what the manifest supplies:
`pages`, `compiled`, plus resolved `currentVersion`, `pdfUrl`, `arxiv`.

### Why postings is a list, not `arxivId?: string`

The failure mode of a single `arxivId` field is that the *first* time a paper
lands anywhere else — Zenodo for a dataset, TSpace for the thesis, a journal DOI
— the model needs surgery and every template that reads it needs a conditional.
A list of `{host, id}` costs nothing now and absorbs all of those.

For `host: 'arxiv'`, the URLs are derived, not stored:

| Purpose  | Derived from `id`                        |
| -------- | ---------------------------------------- |
| Abstract | `https://arxiv.org/abs/<id>`             |
| PDF      | `https://arxiv.org/pdf/<id>`             |
| Version  | `https://arxiv.org/abs/<id>v<n>`         |
| BibTeX   | `eprint = {<id>}, archivePrefix = {arXiv}, primaryClass = {<primaryClass>}` |

## Pages

### `/papers` — the list

Deliberately *not* the chip-and-card-grid used by `/books`, `/blog`, and
`/programming`. Two or three papers do not need faceted search, and the page
should read like a publication list because that is what a reader (or a hiring
committee) expects.

- Grouped by status: **Preprints** / **Published** / **In preparation**, in that
  order; empty groups do not render.
- One row per paper: title, authors, one-line summary, then a metadata line —
  status, arXiv id (linked) or "not yet posted", pages, year.
- Row actions: **Read** (site PDF viewer), **arXiv**, **BibTeX** (copy).
- The abstract is collapsed behind a disclosure on the row; expanding it does not
  navigate. Full detail lives one click deeper.

### `/papers/:slug` — the paper page

Modeled on `programming-detail.component`, which already does back-link, hero,
badge row, copy-able code block, and unknown-slug redirect.

1. Back link to `/papers`.
2. Title, authors, status badge, MSC + arXiv category chips.
3. Action row: Read PDF · arXiv abs · arXiv PDF · DOI · Code.
4. Abstract, full, as authored.
5. Version table — label, date, note, link. Present only with 2+ versions.
6. BibTeX block with copy button (same `copied` flag pattern as the install
   snippet on `/programming/:slug`).
7. Related reading — links into `/notes`, `/blog`, `/books`.

## Build pipeline

Three additions to `nate-website/scripts/`, all wired into the existing
`prebuild`/`prestart` hooks so they gate CI the same way the blog checks do.

**`gen-pdf-manifest`, generalized.** `gen-blog-manifest.js` already extracts page
count and `/CreationDate` from raw PDF bytes with no dependency. Papers need the
identical two facts. Parameterize the directory rather than fork the script:
`node scripts/gen-pdf-facts.js src/assets/pdfs/papers`.

**`sync-arxiv.js`** — for every `postings` entry with `host: 'arxiv'`, query
`http://export.arxiv.org/api/query?id_list=<ids>` and write
`src/assets/papers/arxiv-manifest.json`: current version number, v1 announcement
date, latest update date, primary category, cross-lists, DOI when arXiv has one.
Committed, so the site builds offline and CI never depends on arXiv being up; a
failed fetch warns and leaves the previous manifest in place. This is what stops
the site from drifting out of sync after a v2.

**`check-papers.js`** — build-gating checks, in the spirit of
`check-blog-posts.js`, which exists because a blog card shipped for months
pointing at a PDF that was never compiled:

- every `versions[].file` exists on disk;
- slugs are unique and URL-safe;
- `abstract` is non-empty;
- arXiv ids match `\d{4}\.\d{4,5}(v\d+)?`;
- `status: 'published'` implies a `venue.doi`;
- topic keys resolve against the shared topic vocabulary.

## Crawler-visible metadata

Google Scholar and most citation indexers read `citation_*` meta tags out of the
HTML they are served, and their crawlers do not reliably execute JavaScript.
This site is a client-rendered Angular SPA on GitHub Pages, so setting those tags
at runtime via Angular's `Meta` service makes them visible to a browser and
invisible to the indexer. Runtime `Meta` calls are still worth doing for link
previews (Twitter/Slack/OpenGraph, which do run a headless renderer), but they do
not solve indexing.

The cheap fix, no SSR: a build step `gen-paper-static.js` that, for each paper,
writes `dist/testing/papers/<slug>/index.html` — a copy of the Angular
`index.html` shell with `citation_title`, `citation_author`,
`citation_publication_date`, `citation_pdf_url`, `citation_arxiv_id`,
`citation_abstract_html_url` injected into `<head>`, and the abstract in a
`<noscript>` block. A real browser hitting that URL boots the SPA exactly as it
does today and routes to the right page; a crawler gets static metadata. It slots
into `deploy.yml` right next to the existing SPA-fallback step:

```yaml
- name: SPA fallback for deep links (/series-map etc.)
  run: cp dist/testing/index.html dist/testing/404.html
- name: Static paper stubs with citation metadata
  run: npm run gen:paper-static        # writes dist/testing/papers/<slug>/index.html
```

If arXiv is the canonical index later on, this step can be dropped — but it costs
one script and makes the site's own copy citable in the meantime.

## Migration of the two seed papers

| | Integral Hodge | HRR |
| --- | --- | --- |
| Slug | `integral-hodge-twisting` | `hirzebruch-riemann-roch` |
| Title | Integral Hodge Conjecture — Invariance Under Twisting | Hirzebruch–Riemann–Roch Theorem |
| Kind | `research` | `thesis` |
| Status | `draft` until posted | `draft` |
| Source | `research/integral-hodge/outputs/papers/IHC-Twisted-Invariance/` | `notes/HRR/` |
| Abstract | exists in the `.tex` | written below — the document has none |
| Likely MSC | 14C30, 19L50, 55N22 | 14C40, 19E20 |
| Likely arXiv | math.AG primary, math.AT / math.KT cross | math.AG |

Steps:

1. `git mv` the PDFs from `src/assets/pdfs/notes/` to `src/assets/pdfs/papers/`
   as `integral-hodge-twisting-v1.pdf` and `hirzebruch-riemann-roch-v1.pdf`.
2. Remove the two entries from `notesArray` in `notes.component.ts`.
3. Add a `LEGACY_PDF_REDIRECTS` map in `pdf-viewer.component.ts` rewriting the
   two old `?src=` values to the new paths. The old links are query-string deep
   links of the form `/pdf-viewer?src=./assets/pdfs/notes/HRR.pdf&source=notes`;
   they are indexable and at least one is already pasted into the `/books`
   overview copy, so they must not 404.
4. Teach `pdf-viewer.component.ts` the `source: 'papers'` back-link case
   alongside the existing `notes` / `blog` / `books` branches.
5. Nav order in `header.component.ts`: `books, series map, papers, notes, blog,
   programming, ...` — research ahead of exposition.

`HRR.pdf` is the master's-thesis document (`HRR.tex` and
`Chwojko-Srawley_Nathanael_D_202510_masters_thesis.tex` are the same manuscript).
`kind: 'thesis'` exists so the page can say so rather than presenting it as a
research preprint.

### HRR abstract

`HRR.tex` has no `abstract` environment, so one is authored here. Written
against the document's actual chapter structure — motivation, characteristic
classes, Dolbeault/Kähler and the $\chi_y$-genus, the Todd class, cobordism
reduction, then the Riemann–Roch chapter.

> The Riemann–Roch problem asks how many holomorphic, meromorphic, or algebraic
> sections a space admits — equivalently, what can be said about
> $H^0(X, \mathcal{F})$, and what the higher sheaf cohomology says when that
> group is smaller than expected. This paper develops the answer for holomorphic
> vector bundles over smooth projective varieties, culminating in a proof of the
> Hirzebruch–Riemann–Roch theorem, $\chi(X, E) = \int_X \operatorname{ch}(E)
> \operatorname{td}(T_X)$.
>
> The exposition deliberately reverses Hirzebruch's original order of
> presentation: each tool is introduced at the point where the problem demands
> it rather than in advance. Chern classes and the Chern character are built via
> the splitting principle and placed in $K$-theory; Dolbeault cohomology and
> Kähler geometry supply the bridge between the analytic and algebraic Euler
> characteristics, together with the virtual $\chi_y$-genus that interpolates
> them; the Todd class is derived as a multiplicative sequence; and the oriented
> cobordism ring, with the Hirzebruch signature theorem, reduces the theorem to
> a computation on ring generators. A closing chapter sketches
> Grothendieck–Riemann–Roch and surveys the current generalizations.

`summary` (the one-line card version, no notation):

> A motivated, tools-as-needed proof of Hirzebruch–Riemann–Roch, ending in a
> sketch of the Grothendieck generalization.

Worth doing separately: paste this into `HRR.tex` as a real `abstract`
environment before posting. An arXiv submission needs one in the manuscript,
not only on the website.

## Phases

**Phase 1 — the section. DONE.** `papers.model.ts`, `papers.ts`,
`papers.component.*`, `paper-detail.component.*`, `math-text.component.ts`,
`paper-catalog.service.ts`, `gen-pdf-facts.js`, `check-papers.js`, migration
steps 1–5. Both papers are `status: 'draft'` with no arXiv fields populated.

Verified on the production build: KaTeX resolves to a **lazy chunk**
(260 kB raw / 62 kB transfer) and is absent from the initial bundle, which came
in at 1.78 MB against a 2 MB warning budget. `check-papers.js` parses 23 math
spans across the two abstracts. The old `/notes` deep link
`?src=./assets/pdfs/notes/HRR.pdf` was confirmed against the server log to fetch
`/assets/pdfs/papers/hirzebruch-riemann-roch-v1.pdf`.

BibTeX is generated from the record rather than authored, so it changes shape on
its own: `@unpublished` with a `note` today, `@misc` with `eprint` /
`archivePrefix` / `primaryClass` once `postings` is filled, `@article` with the
DOI once `venue` is.

**Phase 2 — arXiv, on posting.** Fill `postings` on the paper that went up. Add
`sync-arxiv.js` and the arXiv-manifest merge. The list rows and detail page grow
arXiv links because the fields are now non-empty; no template changes.

**Phase 3 — citation surface.** `gen-paper-static.js` + the `deploy.yml` step,
BibTeX generation from the model, runtime `Meta` tags for link previews.

**Phase 4 — optional.** Atom feed at `/papers/feed.xml`; index paper abstracts in
the command palette, which currently covers book content only via
`BookIndexService`.

## Math rendering (KaTeX)

Both abstracts need notation — the Integral Hodge one carries `d_3^{[H]}(1) =
[H] \neq 0` and `\Omega^i(X) \to MU^{2i}(X(\C)) \otimes_{MU^*} \Z`, and the HRR
one above states its theorem inline. The site ships no math renderer today:
`/blog` descriptions containing `$SL_2(F)$` render as literal dollar signs. An
abstract that cannot state its own main theorem is not doing its job, so KaTeX
goes in. Measured against `katex@0.18.4`:

| Asset | Raw | Gzipped |
| --- | --- | --- |
| `katex.min.js` | 273 KB | 76 KB |
| `katex.min.css` | 24 KB | 3.6 KB |
| `fonts/*.woff2` (all 20) | 296 KB | — (already compressed) |

**Keep the JS out of the initial bundle.** Load it with a dynamic `import()`
inside the papers components, so the cost is paid only by a reader who opens a
paper page. The production `initial` budget is 2 MB warn / 3 MB error; a static
import would spend 76 KB of that on every visitor to every route, for a feature
two pages use.

```ts
// in the component, not at module scope
const katex = (await import('katex')).default;
```

**Put the CSS in the global `styles` array**, not in a component. Component
styles are subject to Angular's emulated encapsulation, which rewrites selectors
and breaks KaTeX's — the workaround is `ViewEncapsulation.None`, which then
leaks the rules globally anyway. So skip the indirection: add
`node_modules/katex/dist/katex.min.css` to both `styles` blocks in
`angular.json`. 3.6 KB gzipped is under the 30 KB `anyComponentStyle` warn
threshold either way, and browsers fetch only the woff2 faces a glyph actually
needs — a typical abstract pulls Main-Regular and Math-Italic, not all 296 KB.

**A `MathTextComponent`** splits an authored string on `$…$` and `$$…$$`,
HTML-escapes the literal segments itself, calls `katex.renderToString(tex, {
throwOnError: false, displayMode })` on the math ones, and binds the result
through `DomSanitizer.bypassSecurityTrustHtml`. The escaping matters: KaTeX's own
output is trusted, the prose around it is not automatically so. There is no
user-supplied input anywhere near this — abstracts are authored in `papers.ts` —
but the component should not depend on that being true forever.

**Fail loudly at build, softly at runtime.** `check-papers.js` already runs in
`prebuild`; have it `require('katex')` and call `renderToString` with
`throwOnError: true` on every math span in every abstract, failing the build on a
parse error. Verified against the real package: `\frac{1` throws
`KaTeX parse error: Unexpected end of input in a macro argument`, while the same
input under `throwOnError: false` emits a `katex-error` span. Build gate strict,
runtime lenient — a typo becomes a red CI run, never a blank page.

**Do not put KaTeX output in the citation stubs.** `gen-paper-static.js` writes
`citation_abstract`-adjacent metadata for crawlers, which wants plain text; emit
the raw authored string with its TeX source, not rendered HTML.

Reusable beyond `/papers` once it exists: `/blog` descriptions have wanted it
since `$SL_2(F)$` was written, and `/notes` would want it if notes ever get
abstracts.

## Open decisions

- **Whether `/papers` appears in nav before there is a preprint.** Two drafts is
  a thin page. Alternative: build it now, link it from `/notes` and `/about`, add
  it to nav when the first arXiv posting lands.
- **Co-author handling.** `authors: string[]` is ordered and renders as typed.
  Per-author links (arXiv author pages, ORCID) are deferred until there is a
  co-author.
