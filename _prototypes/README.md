# Prototypes

Design explorations for the site, kept as reusable templates. Self-contained
HTML with the site's palette inlined — no build step, no framework, no install.

**Nothing here is deployed.** The Pages workflow only triggers on
`nate-website/**` and only publishes `nate-website/dist/testing`; this directory
sits above both.

## Viewing

```sh
./_prototypes/serve.sh            # port 8777, opens a browser
./_prototypes/serve.sh 9000       # somewhere else
```

Then <http://localhost:8777/> for the gallery. Already-running ports are
detected rather than clobbered.

You can also just open the file — `open _prototypes/blog-redesign.html`.
Everything works from `file://` except the Broadsheet's thumbnails, which some
browsers block as cross-origin.

## What's here

| File | What it is |
| --- | --- |
| `index.html` | Gallery landing page. Add a card when you add a prototype. |
| `blog-redesign.html` | Five `/blog` layouts, tabs `0`–`4`, deep-linkable via `?v=stream`. **Stream is the chosen direction.** |
| `thumbs/` | Page-1 PNG renders of the blog PDFs, used only by the Broadsheet. |
| `gen-thumbs.sh` | Rebuilds `thumbs/` with `pdftoppm`. Run after adding a blog PDF. |
| `serve.sh` | Local static server. |

## Reusing one as a template for another page

The four blog layouts are page-shape ideas, not blog-specific:

- **Stream** — chronological, typographic, no containers. Suits anything dated
  and text-first: a papers list, a talks list, a changelog.
- **Ladder** — a shared three-step ramp as the page's spine. Suits anything with
  a prerequisite or difficulty order.
- **Constellation** — nodes plus authored edges into a side panel. Closest
  relative is the existing `/series-map`.
- **Broadsheet** — build-time renders of the underlying documents as the art.
  Works for any page whose items are PDFs.

Each variant is one `<div class="panel">` plus one CSS block plus one IIFE, all
labelled with the same banner comment. Copy those three pieces into a new file
and swap the `POSTS` array.

## Conventions

- Palette tokens at the top of each file are copied from
  `nate-website/src/sass/_variables.scss` and `blog.component.scss`. If the site
  theme changes, they drift — they are a snapshot, not an import.
- Use real data. Every date and page count in `blog-redesign.html` comes from
  `src/assets/pdfs/blogs/manifest.json`; invented content is flagged in the UI
  (see the dotted `planned` rows in the Stream) so a screenshot months later is
  still honest about what is real.
