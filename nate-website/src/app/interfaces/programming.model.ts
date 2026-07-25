export type ProgramStatus = 'stable' | 'beta' | 'wip' | 'archived';

export type ProgramCategory = 'distro' | 'nvim' | 'cli' | 'tools' | 'dotfiles';

// A single visual (screenshot / gif / short video) for a project. Populated
// incrementally; the detail page renders whatever is present.
export interface ProgramMedia {
  type: 'image' | 'gif' | 'video';
  src: string;          // asset path (e.g. assets/img/programming/<slug>/demo.gif) or url
  poster?: string;      // still frame for video
  alt?: string;
  caption?: string;
}

export interface Program {
  name: string;
  slug: string;                 // url segment for /programming/:slug
  category: ProgramCategory;
  tagline: string;              // one line, shown on the card
  desc: string;                 // full paragraph, shown on the detail page
  status: ProgramStatus;
  ecosystem?: string;           // 'Neovim' | 'CLI' | 'macOS'
  language?: string;            // 'Lua' | 'Go' | 'Shell'
  repo?: string;                // GitHub url; absent => "coming soon", no outbound link
  docsUrl?: string;             // Phase-2 hook: a dedicated docs site
  demoUrl?: string;
  install?: string;             // copy-able snippet (lazy.nvim spec / shell)
  features?: string[];          // bullets on the detail page
  hero?: ProgramMedia;          // lead visual for the card + top of the detail page
  media?: ProgramMedia[];       // gallery on the detail page
}

// Display metadata for the category sections on the landing page, in render order.
export interface CategoryMeta {
  key: ProgramCategory;
  label: string;
  blurb: string;
}

export const CATEGORY_ORDER: CategoryMeta[] = [
  { key: 'distro',   label: 'Distribution',    blurb: 'A full Neovim setup out of the box.' },
  { key: 'nvim',     label: 'Neovim plugins',  blurb: 'Standalone plugins and picker extensions.' },
  { key: 'cli',      label: 'CLI & libraries', blurb: 'Command-line tools and reusable backends.' },
  { key: 'tools',    label: 'Tooling',         blurb: 'Workflow helpers for notes and this site.' },
  { key: 'dotfiles', label: 'Dotfiles',        blurb: 'My machine, reproducible from scratch.' },
];

export const STATUS_LABEL: Record<ProgramStatus, string> = {
  stable: 'stable',
  beta: 'beta',
  wip: 'in progress',
  archived: 'archived',
};
