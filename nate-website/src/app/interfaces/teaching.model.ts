// One animation shown in lecture. `src` and `poster` are asset paths.
export interface TeachingClip {
  code: string;         // 'C01': matches the clip names in the lesson plans
  title: string;
  blurb: string;        // one line, shown under the title
  seconds: number;      // length, shown on the thumbnail
  src: string;
  poster: string;       // still frame shown before the clip plays
}

export interface ClipGroup {
  title: string;        // e.g. 'In the plane'
  clips: TeachingClip[];
}

export interface TeachingChapter {
  title: string;        // 'Chapter 7: Determinants'
  blurb: string;
  groups: ClipGroup[];
}

export interface Course {
  slug: string;         // url segment for /teaching/:slug
  code: string;         // 'MAT223'
  title: string;        // 'Linear Algebra I'
  term: string;         // 'Fall 2026'
  role: string;         // 'Instructor'
  institution: string;
  blurb: string;        // shown on the /teaching card
  chapters: TeachingChapter[];
}
