// Where a paper is in its life, not what it is about.
export type PaperStatus =
  | 'draft'       // written, on-site, not posted anywhere else
  | 'preprint'    // on arXiv (or similar), not submitted
  | 'submitted'   // under review at a venue
  | 'accepted'    // accepted, not yet in print
  | 'published';  // has a DOI

export type PaperKind = 'research' | 'thesis' | 'survey';

// WHO wrote it. Orthogonal to status: a machine-produced paper still moves
// draft -> preprint -> published like any other, so this must not be folded
// into PaperStatus. Absent means 'human', so every existing entry is unchanged.
//   'human'   — written by me.
//   'machine' — written by the agentic research system, under my direction.
//               Rendered in a separated, explicitly labelled section at the
//               bottom of /papers. The separation is the point; see
//               MACHINE_SECTION below and AI-PAPERS-SECTION.md at the repo root.
export type PaperProvenance = 'human' | 'machine';

export const STATUS_LABEL: Record<PaperStatus, string> = {
  draft: 'draft',
  preprint: 'preprint',
  submitted: 'submitted',
  accepted: 'accepted',
  published: 'published',
};

export const KIND_LABEL: Record<PaperKind, string> = {
  research: 'Research paper',
  thesis: 'Thesis',
  survey: 'Survey',
};

// The trailing, separated section for machine-produced work. Deliberately not
// a STATUS_SECTION: those group my own papers by lifecycle, and this sits below
// all of them behind a hard visual break.
//
// Wording is load-bearing and was chosen carefully - do not compress it:
//   - NOT "AI-proven". "Proven" means verified in mathematics, and this cleared
//     adversarial review and a numerical battery, not a proof assistant.
//     "AI-" alone also erases the direction, which is the human contribution.
//   - the "I set the problem ... I did not derive the result" sentence is what
//     makes the corresponding resume claim defensible. Keep it verbatim.
//   - the closing referee line answers the obvious question before it is asked.
//     Remove it only when it stops being true.
export const MACHINE_SECTION = {
  label: 'Papers written by an AI system I directed',
  standfirst:
    'Everything below here has been proven by AI, and read-through by me to the best of my ability.',
  body: [
    `With the rise of AI, I wanted test for myself how good is getting. So I built an agentic research system that is self-aware of the validity of its results (is it derived, conjectured, mixed with assumptions, etc) is able to build off of its own research results, can detect when it is backed into a corner and start new research initiatives, and is aware of important results to re-check thoroughly. I pointed it at an open problem and directed it across multiple sessions. The papers below are the outcome. I did not derive the result.`
  ],
};

// Section headings on /papers, in render order. Empty sections do not render.
export const STATUS_SECTIONS: { keys: PaperStatus[]; label: string; blurb: string }[] = [
  {
    keys: ['published', 'accepted'],
    label: 'Published',
    blurb: 'In print, or accepted and on the way there.',
  },
  {
    keys: ['preprint', 'submitted'],
    label: 'Preprints',
    blurb: 'Posted publicly; some under review.',
  },
  {
    keys: ['draft'],
    label: 'In preparation',
    blurb: 'Written up and readable here, not yet posted elsewhere.',
  },
];

// A public posting. arXiv is one host among several so that the first Zenodo or
// institutional-repository entry is not a special case requiring model surgery.
export type PaperHost = 'arxiv' | 'zenodo' | 'hal' | 'tspace' | 'other';

export interface PaperPosting {
  host: PaperHost;
  id: string;             // '2604.01234' for arXiv; a handle elsewhere
  url?: string;           // required for 'other', derived for the known hosts
  primaryClass?: string;  // arXiv primary category, e.g. 'math.AG'
  crossLists?: string[];  // e.g. ['math.AT', 'math.KT']
  announced?: string;     // ISO date of the v1 announcement
}

export const HOST_LABEL: Record<PaperHost, string> = {
  arxiv: 'arXiv',
  zenodo: 'Zenodo',
  hal: 'HAL',
  tspace: 'TSpace',
  other: 'Preprint',
};

// arXiv is versioned, so the site has to be able to say which version it serves.
export interface PaperVersion {
  label: string;  // 'v1', 'v2', 'submitted', 'final'
  date: string;   // ISO
  file: string;   // path under assets/pdfs/papers/
  note?: string;  // 'referee revisions', 'typos'
}

export interface PaperVenue {
  name: string;
  volume?: string;
  pages?: string;
  year?: number;
  doi?: string;
}

// Abstracts may contain TeX between $…$ / $$…$$; MathTextComponent renders it.
export interface PaperEntry {
  slug: string;
  title: string;
  authors: string[];        // ordered
  kind: PaperKind;
  status: PaperStatus;
  abstract: string;
  summary?: string;         // one line, no notation, for the list row
  msc?: string[];           // MSC 2020 classes
  keywords?: string[];
  versions: PaperVersion[]; // oldest first; the last entry is what is served
  postings?: PaperPosting[];
  venue?: PaperVenue;
  code?: string;
  relatedNotes?: { label: string; route?: string; href?: string; query?: Record<string, string> }[];
  bibtexKey?: string;
  provenance?: PaperProvenance;   // default 'human'
}

// A paper as rendered: the authored entry plus what the PDF-facts manifest
// supplies, plus the handful of things derived from `postings` and `versions`
// once here rather than in three templates.
export interface Paper extends PaperEntry {
  current: PaperVersion;
  pdfUrl: string;
  file: string;             // PDF basename — the manifest key
  kindLabel: string;
  statusLabel: string;
  pages?: number;
  compiled?: string;        // ISO date the served PDF was typeset
  arxiv?: PaperPosting;
  arxivAbsUrl?: string;
  arxivPdfUrl?: string;
  year: number;
  bibtex: string;
}

export interface PaperPdfMeta {
  pages: number | null;
  updated: string | null;
  readingMinutes: number | null;
}
export type PaperManifest = Record<string, PaperPdfMeta>;

export const arxivAbs = (id: string) => `https://arxiv.org/abs/${id}`;
export const arxivPdf = (id: string) => `https://arxiv.org/pdf/${id}`;
