import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  Program,
  ProgramCategory,
  CATEGORY_ORDER,
  CategoryMeta,
} from 'src/app/interfaces/programming.model';

export const programmingArray: Program[] = [
  {
    name: 'NoetherVim',
    slug: 'noethervim',
    category: 'distro',
    status: 'beta',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'A Neovim distribution for mathematics and multilingual writing.',
    desc: 'A custom Neovim distribution built for mathematics and multilingual workflows. Designed around LaTeX editing, structured note-taking, and development across multiple languages, with a curated set of plugins and configurations out of the box. LaTeX, BibTeX, and VimTeX get the same first-class support as LSP and treesitter; everything else you expect (completion, DAP, diagnostics, formatters) is configured and lazy-loaded.',
    repo: 'https://github.com/Chiarandini/NoetherVim',
    docsUrl: '/noethervim/',
    install:
      'mkdir -p ~/.config/nvim\n' +
      'curl -fLo ~/.config/nvim/init.lua \\\n' +
      '  https://raw.githubusercontent.com/Chiarandini/NoetherVim/main/init.lua.example\n' +
      'nvim',
    features: [
      'Curated math workflow: LaTeX / BibTeX / VimTeX on par with LSP and treesitter',
      'Deep-merge override model on lazy.nvim with auto-imported bundle directories',
      '`:NoetherVim diff keymaps` / `diff options` to inspect what your config overrides',
      'Fast startup via aggressive lazy-loading',
    ],
  },
  {
    name: 'noethervim-tex',
    slug: 'noethervim-tex',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'A LaTeX companion plugin for mathematical writing.',
    desc: 'A LaTeX companion plugin for Neovim, built for mathematical writing. Provides context-aware LuaSnip snippets, treesitter textobject navigation, a preamble completion source, custom syntax highlights, and a spell dictionary of 900+ mathematical terms. Standalone by design, but integrates seamlessly with NoetherVim as part of its latex bundle.',
    repo: 'https://github.com/Chiarandini/noethervim-tex',
    install: "{ 'Chiarandini/noethervim-tex' }",
    features: [
      'Context-aware LuaSnip snippets for math',
      'Treesitter textobject navigation',
      'Preamble completion source',
      '900+ term mathematical spell dictionary',
    ],
  },
  {
    name: 'noethervim-typst',
    slug: 'noethervim-typst',
    category: 'nvim',
    status: 'wip',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'A Typst companion plugin for mathematical writing.',
    desc: 'A Typst companion plugin for Neovim, built for mathematical writing. Provides context-aware LuaSnip snippets, treesitter textobject navigation, custom syntax highlights, and a spell dictionary of 900+ mathematical terms. Standalone by design, but integrates seamlessly with NoetherVim as part of its typst bundle. Public repository coming soon.',
    features: [
      'Context-aware LuaSnip snippets for Typst',
      'Treesitter textobject navigation',
      '900+ term mathematical spell dictionary',
    ],
  },
  {
    name: 'noethervim-tableaux',
    slug: 'noethervim-tableaux',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'Mathematical dashboard scenes for snacks.nvim.',
    desc: "A collection of mathematical tableaux (dashboard scenes) for snacks.nvim. 31 presets ranging from animated number-theoretic processes (Sieve of Eratosthenes, Collatz trajectories, convergents of pi) to live dynamical systems (Conway's Game of Life, Lorenz attractor) to topological objects (Konigsberg bridges, fundamental polygons of closed surfaces) to contemplative scenes.",
    repo: 'https://github.com/Chiarandini/noethervim-tableaux',
    install: "{ 'Chiarandini/noethervim-tableaux', dependencies = { 'folke/snacks.nvim' } }",
    features: [
      '31 dashboard presets',
      'Animated number-theoretic processes (sieve, Collatz, convergents of pi)',
      'Live dynamical systems (Game of Life, Lorenz attractor)',
      'Topological scenes (Konigsberg bridges, fundamental polygons)',
    ],
  },
  {
    name: 'KeyboardMode',
    slug: 'keyboard-mode',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'Switch keyboard layouts on the fly in insert mode.',
    desc: 'A "keyboard mode" for Neovim: switch keyboard layouts while in insert mode, choosing a default and an alternate layout. Good for writing text in insert mode with keyboards such as Cyrillic, Japanese, Korean, Chinese, Devanagari, Arabic, and more.',
    repo: 'https://github.com/Chiarandini/KeyboardMode',
    install: "{ 'Chiarandini/KeyboardMode' }",
    features: [
      'Toggle an alternate keyboard layout inside insert mode',
      'Configurable default and alternate layouts',
      'Built for multilingual writing (Cyrillic, CJK, Devanagari, Arabic, ...)',
    ],
  },
  {
    name: 'smart-actions.nvim',
    slug: 'smart-actions',
    category: 'nvim',
    status: 'beta',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'AI-suggested code actions alongside the stock LSP flow.',
    desc: 'AI-suggested code actions for Neovim, complementing the stock LSP code-action flow. Entry points include quickfix actions (grA), prose explanations of diagnostics (grE), language-appropriate suppression comments (grS), behaviour-preserving refactors (grR), single-test generation (grT), and broad review with severity-tagged findings (grV). All share a scope picker, a Claude Code CLI to Anthropic API provider layer with fallback, and a pluggable context system.',
    repo: 'https://github.com/Chiarandini/smart-actions.nvim',
    install: "{ 'Chiarandini/smart-actions.nvim' }",
    features: [
      'Quickfix, explain, suppress, refactor, test, and review entry points',
      'Shared scope picker across all actions',
      'Claude Code CLI to Anthropic API provider layer with fallback',
      'Pluggable context system',
    ],
  },
  {
    name: 'smart-enter.nvim',
    slug: 'smart-enter',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'A context-dispatched newline: one key does the right thing.',
    desc: "A context-dispatched newline. One insert-mode key (default <S-CR>) does the right thing for where the cursor is: continues a LaTeX environment (\\\\ in a matrix, \\\\ then &= in align, \\item in a list), continues a Markdown list, checkbox, or blockquote (renumbering ordered lists, exiting on an empty item), or otherwise inserts a plain newline that doesn't re-insert a comment leader. Rules are plain data; LaTeX detection is Treesitter based with no VimTeX dependency.",
    repo: 'https://github.com/Chiarandini/smart-enter.nvim',
    install: "{ 'Chiarandini/smart-enter.nvim' }",
    features: [
      'Continues LaTeX environments (matrix, align, lists)',
      'Continues Markdown lists, checkboxes, blockquotes with renumbering',
      'Treesitter-based LaTeX detection, no VimTeX dependency',
      'Rules are plain data, extensible per filetype via setup()',
    ],
  },
  {
    name: 'wrapsearch.nvim',
    slug: 'wrapsearch',
    category: 'nvim',
    status: 'beta',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'Search across hard-wrapped lines.',
    desc: "Hard-wrapped prose breaks search. A phrase that reads as one line on screen has a newline somewhere in the middle, so /brown fox finds nothing when the wrap happens to fall between those two words. That is a constant irritation in LaTeX, where hard wrapping is the norm. wrapsearch rewrites the pattern just before the search runs, so a literal space also matches a line break and the next line's indentation. Because the rewritten pattern is what Neovim actually searches for, n, N, search offsets, the search register and match highlighting all keep working with no special handling. The rewrite is conservative: spaces inside a collection, escaped spaces and the inside of a quantifier are left alone, and g/ searches verbatim when a space really does mean a space.",
    repo: 'https://github.com/Chiarandini/wrapsearch.nvim',
    install: "{ 'Chiarandini/wrapsearch.nvim', ft = { 'tex', 'markdown' }, opts = {} }",
    features: [
      'Makes / and ? match a phrase split by a hard wrap',
      'n, N, search offsets and the search register are unaffected',
      'Conservative: collections, escaped spaces and quantifiers are left alone',
      'g/ and g? search verbatim for one search',
      'Scoped to prose filetypes by default; code searches are untouched',
    ],
  },
  {
    name: 'telescope-latex-references',
    slug: 'telescope-latex-references',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'A fast, environment-aware LaTeX label/reference picker.',
    desc: 'A fast Telescope label and reference finder for LaTeX. I did not find any good label finder plugin, so I made this one. Its aim was speed and being aware of labels that are implicit in environments (e.g. \\begin{theorem}{title}{label}).',
    repo: 'https://github.com/Chiarandini/telescope-latex-references',
    install:
      "{ 'Chiarandini/telescope-latex-references',\n" +
      "  dependencies = { 'nvim-telescope/telescope.nvim' } }",
    features: [
      'Fast label/reference search across large projects',
      'Aware of labels implicit in environments',
      'Shares its on-disk cache with the snacks-native sibling',
    ],
  },
  {
    name: 'telescope-cached-headings',
    slug: 'telescope-cached-headings',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'Heading navigation that stays fast on huge LaTeX files.',
    desc: 'The default "Telescope headings" picker is very slow on my huge LaTeX files (e.g. ~100k lines). This plugin is my solution to that problem: a cached heading picker for LaTeX, Markdown, and Org-mode that only scans a file once.',
    repo: 'https://github.com/Chiarandini/telescope-cached-headings.nvim',
    install:
      "{ 'Chiarandini/telescope-cached-headings.nvim',\n" +
      "  dependencies = { 'nvim-telescope/telescope.nvim' } }",
    features: [
      'On-disk heading cache: scan once, jump instantly',
      'Handles very large (~100k line) LaTeX files',
      'LaTeX, Markdown, and Org-mode',
    ],
  },
  {
    name: 'telescope-pdf-browser',
    slug: 'telescope-pdf-browser',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'Fuzzy-find and open PDFs (or run any file) from Telescope.',
    desc: 'A simple Telescope extension to open PDFs (or really execute any file) after fuzzy searching them.',
    repo: 'https://github.com/Chiarandini/telescope-pdf-browser.nvim',
    install:
      "{ 'Chiarandini/telescope-pdf-browser.nvim',\n" +
      "  dependencies = { 'nvim-telescope/telescope.nvim' } }",
    features: [
      'Fuzzy-find PDFs and open them in your viewer',
      'Can execute any file, not just PDFs',
    ],
  },
  {
    name: 'snacks-bibtex',
    slug: 'snacks-bibtex',
    category: 'nvim',
    status: 'beta',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'A snacks.nvim picker for BibTeX citations.',
    desc: "A Snacks.nvim picker for BibTeX citations. Scans .bib files discovered from the current buffer's bibliography directives (\\bibliography{}, \\addbibresource{}, Pandoc/Quarto bibliography: frontmatter) or from an explicit list, and inserts the selected cite key in a filetype-appropriate format. Inspired by telescope-bibtex.nvim and built for NoetherVim's telescope-removal effort.",
    repo: 'https://github.com/Chiarandini/snacks-bibtex.nvim',
    install: "{ 'Chiarandini/snacks-bibtex.nvim', dependencies = { 'folke/snacks.nvim' } }",
    features: [
      'Auto-discovers .bib files from buffer bibliography directives',
      'Filetype-appropriate cite-key insertion',
      'Snacks-native, no Telescope dependency',
    ],
  },
  {
    name: 'snacks-cached-headings',
    slug: 'snacks-cached-headings',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'The snacks.nvim companion to my cached headings picker.',
    desc: 'A Snacks.nvim picker for fast heading navigation in LaTeX, Markdown, and Org-mode files. This is the Snacks-native companion to telescope-cached-headings.nvim; both plugins share the same on-disk cache, so a file is only scanned once regardless of which picker you open first.',
    repo: 'https://github.com/Chiarandini/snacks-cached-headings.nvim',
    install:
      "{ 'Chiarandini/snacks-cached-headings.nvim',\n" +
      "  dependencies = { 'folke/snacks.nvim', 'Chiarandini/latex-nav-core.nvim',\n" +
      "                   'Chiarandini/telescope-cached-headings.nvim' } }",
    features: [
      'Snacks-native heading navigation for LaTeX, Markdown, Org',
      'Shares the on-disk cache with the Telescope sibling',
    ],
  },
  {
    name: 'snacks-latex-labels',
    slug: 'snacks-latex-labels',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'The snacks.nvim companion to my LaTeX label picker.',
    desc: 'A Snacks.nvim picker for fast LaTeX label navigation. This is the Snacks-native companion to telescope-latex-references; both plugins share the same on-disk cache, so the project is only scanned once regardless of which picker you open first.',
    repo: 'https://github.com/Chiarandini/snacks-latex-labels.nvim',
    install:
      "{ 'Chiarandini/snacks-latex-labels.nvim',\n" +
      "  dependencies = { 'folke/snacks.nvim', 'Chiarandini/latex-nav-core.nvim',\n" +
      "                   'Chiarandini/telescope-latex-references' } }",
    features: [
      'Snacks-native LaTeX label navigation',
      'Shares the on-disk cache with the Telescope sibling',
    ],
  },
  {
    name: 'snacks-zotero',
    slug: 'snacks-zotero',
    category: 'nvim',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'A snacks.nvim picker for Zotero citations.',
    desc: 'A Snacks.nvim picker for Zotero citations. A Snacks-native port of telescope-zotero.nvim, compatible with Zotero 7 (via Better BibTeX) and Zotero 8 (native citation keys). Lists references from your local Zotero library and inserts them into a bib file.',
    repo: 'https://github.com/Chiarandini/snacks-zotero.nvim',
    install:
      "{ 'Chiarandini/snacks-zotero.nvim',\n" +
      "  dependencies = { 'folke/snacks.nvim', 'kkharji/sqlite.lua' } }",
    features: [
      'Browse your local Zotero library from Neovim',
      'Zotero 7 (Better BibTeX) and Zotero 8 (native keys)',
      'Inserts citations into your .bib file',
    ],
  },
  {
    name: 'Trilingual Dictionary',
    slug: 'trilingual-dict',
    category: 'cli',
    status: 'beta',
    ecosystem: 'CLI',
    language: 'Go',
    tagline: 'A Japanese / Chinese / English dictionary, backend and CLI.',
    desc: "I couldn't find a good dictionary for Japanese / Chinese / English all at once, so I created one. The back-end is a Go library, wrapped in a CLI so I can use it as a Neovim plugin, but also exportable so I can build an iOS app with it as well as host it on my website.",
    repo: 'https://github.com/Chiarandini/trilingual-dict',
    features: [
      'Simultaneous Japanese / Chinese / English lookup',
      'Go library core, wrapped as a CLI',
      'Reusable across a Neovim plugin, an iOS app, and the web',
    ],
  },
  {
    name: 'Obsidian Tools',
    slug: 'obsidian-tools',
    category: 'tools',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'Helpers for organizing my Obsidian notes.',
    desc: 'A collection of tools that help me organize my Obsidian notes. Mainly a collection of APIs for managing tags, improving syncing between phone and computer, and creating new notes.',
    repo: 'https://github.com/Chiarandini/ObsidianTools',
    install: "{ 'Chiarandini/ObsidianTools' }",
    features: [
      'Tag-management APIs',
      'Better phone / computer syncing',
      'Quick note creation',
    ],
  },
  {
    name: 'Website Tools',
    slug: 'website-tools',
    category: 'tools',
    status: 'stable',
    ecosystem: 'Neovim',
    language: 'Lua',
    tagline: 'Helpers for authoring and publishing this website.',
    desc: 'A collection of tools that help me manage this website: programs to quickly create notes, books, and blogs, edit templates, publish to the site, and so forth.',
    repo: 'https://github.com/Chiarandini/WebsiteTools',
    install: "{ 'Chiarandini/WebsiteTools' }",
    features: [
      'Scaffold notes, books, and blog posts',
      'Edit site templates',
      'One-command publishing',
    ],
  },
  {
    name: 'collatz-chains',
    slug: 'collatz-chains',
    category: 'numerics',
    status: 'stable',
    ecosystem: 'CLI',
    language: 'Rust',
    tagline: 'Monte Carlo on the accelerated Collatz map, without bignum arithmetic.',
    desc: "A Rust workspace for large-scale statistical experiments on the accelerated Collatz map. An integer is represented as a chain, a list of positive integers, and one Collatz step becomes a local rewriting rule on that list rather than an arithmetic operation on the number. The cost of a step is then linear in the length of the encoding rather than in the magnitude of the integer, so trajectories can be pushed far past the point where 64-bit arithmetic overflows without paying for arbitrary-precision arithmetic. Three crates: nextform implements the rewriting as a two-state automaton behind a stable C ABI; mc_chains is a multithreaded Monte Carlo driver that iterates it over populations of random chains and emits per-iteration distributional histograms; mc_simd is a 4-lane NEON rewrite that loses to the scalar code, kept in the tree as a documented negative result.",
    repo: 'https://github.com/Chiarandini/collatz-chains',
    install:
      'git clone https://github.com/Chiarandini/collatz-chains\n' +
      'cd collatz-chains && cargo build --release\n' +
      './target/release/mc_chains 5000 1000 25 4 --out logs/run.json',
    features: [
      'Two-state DFA computes one accelerated-Collatz step in a single left-to-right pass, linear in encoding length',
      'Each automaton state compiled to its own hot loop with one predictable exit, so the branch predictor specialises per state (~1.7x over the naive port)',
      'Allocation-free, reentrant, stable C ABI: callable from C, Python, Go, .NET, or WebAssembly',
      'Multithreaded driver at ~95 ns per chain-iteration, within ~10% of the floor set by the transformation itself',
      'Bit-exact reproducible runs with a fixed seed schedule, plus checkpoint and resume for multi-hour studies',
      'A measured SIMD negative result: 0.16s vs 0.13s, with a mechanistic explanation rather than a shrug',
    ],
  },
  {
    name: 'macOS Dotfiles & Automated Setup',
    slug: 'dotfiles',
    category: 'dotfiles',
    status: 'stable',
    ecosystem: 'macOS',
    language: 'Shell',
    tagline: 'Turn a fresh Mac into my full dev environment, scripted.',
    desc: 'My personal macOS dotfiles and an automated bootstrap script that turns a fresh Mac into a fully configured developer environment. Covers shell, terminals, Neovim, tmux, yabai tiling, git, and LaTeX setup.',
    repo: 'https://github.com/Chiarandini/dotfiles',
    features: [
      'One-shot bootstrap of a fresh Mac',
      'Shell, terminals, Neovim, tmux, git, LaTeX',
      'yabai tiling window management',
    ],
  },
];

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.scss'],
})
export class ProgrammingComponent {
  readonly categories: CategoryMeta[] = CATEGORY_ORDER;
  private readonly programs = programmingArray;

  query = '';
  activeCategory: ProgramCategory | 'all' = 'all';

  constructor(private router: Router) {}

  // Counts drive the filter chips (and hide empty ones).
  countFor(key: ProgramCategory): number {
    return this.programs.filter((p) => p.category === key).length;
  }

  // Categories that survive the current search + chip selection, each with its
  // matching projects, in CATEGORY_ORDER.
  get visibleGroups(): { meta: CategoryMeta; programs: Program[] }[] {
    const q = this.query.trim().toLowerCase();
    return this.categories
      .filter((c) => this.activeCategory === 'all' || this.activeCategory === c.key)
      .map((meta) => ({
        meta,
        programs: this.programs.filter(
          (p) =>
            p.category === meta.key &&
            (!q ||
              p.name.toLowerCase().includes(q) ||
              p.tagline.toLowerCase().includes(q) ||
              p.desc.toLowerCase().includes(q) ||
              (p.language ?? '').toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.programs.length > 0);
  }

  get hasResults(): boolean {
    return this.visibleGroups.length > 0;
  }

  setCategory(key: ProgramCategory | 'all'): void {
    this.activeCategory = key;
  }

  clearSearch(): void {
    this.query = '';
  }

  openDetail(program: Program): void {
    this.router.navigate(['/programming', program.slug]);
  }

  openRepo(program: Program, event: Event): void {
    event.stopPropagation();
    if (program.repo) window.open(program.repo, '_blank');
  }

  trackBySlug = (_: number, p: Program): string => p.slug;
}
