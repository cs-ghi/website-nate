import { BlogDomain, BlogDomainMeta, BlogEntry } from 'src/app/interfaces/blog.model';

// Two-tier taxonomy: domain first, then that domain's own topics.
//
// The maths topics are deliberately coarser than the textbooks' taxonomy
// (book-topics.ts) — ten posts do not need twelve buckets, and a filter row is
// only useful while every entry on it has something behind it. `foundations` is
// the one that is not a subject: it holds the posts that are about how to look
// at a subject rather than about a result in it.
//
// Domains and topics with nothing behind them are not rendered, so listing a
// topic here ahead of writing for it costs nothing.
export const BLOG_DOMAINS: BlogDomainMeta[] = [
  {
    key: 'maths',
    label: 'Mathematics',
    topics: [
      {
        key: 'analysis',
        label: 'Analysis',
        blurb: 'Fourier theory, Hilbert spaces, and what complex analysis is really doing.',
      },
      {
        key: 'algebra',
        label: 'Algebra',
        blurb: 'Galois theory, homological algebra, and representations.',
      },
      {
        key: 'number-theory',
        label: 'Number Theory',
        blurb: 'From modular arithmetic to the local Langlands correspondence.',
      },
      {
        key: 'geometry',
        label: 'Geometry & Topology',
        blurb: 'Schemes, manifolds, and spaces that behave badly on purpose.',
      },
      {
        key: 'foundations',
        label: 'Perspective',
        blurb: 'Posts about how to see a subject rather than about a result in it.',
      },
    ],
  },
  {
    key: 'ai',
    label: 'AI',
    topics: [
      { key: 'ai-systems', label: 'Systems & Practice', blurb: 'How the things are actually built and run.' },
      { key: 'interpretability', label: 'Interpretability', blurb: 'What is going on inside, and how anyone could know.' },
      { key: 'ai-and-maths', label: 'AI and Mathematics', blurb: 'Machines doing mathematics, and mathematics about machines.' },
    ],
  },
  {
    key: 'philosophy',
    label: 'Philosophy',
    topics: [
      { key: 'epistemology', label: 'Epistemology', blurb: 'What knowledge is, and what it would take to have some.' },
      { key: 'phil-of-maths', label: 'Philosophy of Mathematics', blurb: 'What mathematical objects are and why the subject works.' },
    ],
  },
  {
    key: 'quant',
    label: 'Quant',
    topics: [
      { key: 'markets', label: 'Markets', blurb: 'Structure, incentives, and where the mathematics meets the money.' },
      { key: 'stochastics', label: 'Stochastic Models', blurb: 'The processes underneath, without the machinery where possible.' },
    ],
  },
];

export const DOMAIN_LABELS: Record<string, string> = Object.fromEntries(
  BLOG_DOMAINS.map((d) => [d.key, d.label]),
);

export const TOPIC_LABELS: Record<string, string> = Object.fromEntries(
  BLOG_DOMAINS.flatMap((d) => d.topics).map((t) => [t.key, t.label]),
);

// Which domain a topic key belongs to — used by the build check to reject a
// maths topic on a philosophy post, the error this taxonomy most invites.
export const TOPIC_DOMAIN: Record<string, BlogDomain> = Object.fromEntries(
  BLOG_DOMAINS.flatMap((d) => d.topics.map((t) => [t.key, d.key])),
);

// Posts. Rendered order comes from `published` (or `intendedDate` for a planned
// entry with no PDF), so this array's order is not load-bearing. It used to come
// from the PDF compile dates in the manifest, which meant recompiling reordered
// the stream; the dates below were recovered from the earliest /CreationDate for
// each PDF in git history, since the compile dates themselves no longer hold
// that information.
//
// `link` is the only field tying an entry to its PDF; scripts/check-blog-posts.js
// fails the build if it points at a file that is not there.
//
// Entries marked `planned` have no PDF and are hidden from visitors until the
// lock at the bottom of /blog is opened. They exist so a written-but-uncompiled
// draft has somewhere to sit, and so a domain with nothing published in it yet
// is visible to me without being advertised.
export const BLOG_POSTS: BlogEntry[] = [
  {
    name: 'Intuition on Fourier Analysis',
    desc: 'Blurb from my real analysis notes extracted to be a separate blog.',
    link: '././assets/pdfs/blogs/fourier_transforms.pdf',
    published: '2026-03-06',
    domain: 'maths',
    topic: 'analysis',
    level: 'deep',
  },
  {
    name: 'Some Geometry of Hilbert Spaces',
    desc: "This blog covers some intuition I've developed when trying to really undersatnd why Hilbert space of all the Lp spaces is the right generalization of euclidean space, namely I dive into how to think of Hilbert space as 'flat' as compared to other Lp spaces.",
    link: '././assets/pdfs/blogs/geometric_intuition_of_hilbert_spaces.pdf',
    published: '2026-03-02',
    domain: 'maths',
    topic: 'analysis',
    alsoTopics: ['geometry'],
    level: 'deep',
  },
  {
    name: 'A Narrative of Homological Algebra',
    desc: 'I had a sudden idea of how I see the chronology of homological algebra. I tried to make it as historically as possible. ',
    link: '././assets/pdfs/blogs/a_narrative_of_homological_algebra.pdf',
    published: '2026-02-21',
    domain: 'maths',
    topic: 'algebra',
    alsoTopics: ['foundations'],
    level: 'deep',
  },
  {
    name: 'Non-Hausdorff Space',
    desc: 'A quick blog for non-mathematicians to see an example of a space that can have two points infinitely close to each other while remaining distinct',
    link: '././assets/pdfs/blogs/nonhausdorfness.pdf',
    published: '2026-02-07',
    domain: 'maths',
    topic: 'geometry',
    level: 'open',
  },
  {
    name: 'Some Harmonic Analysis',
    desc: 'This is an extract from EYNTKA Algebra that goes over how the representation of finite abelian groups links to Harmonic analysis. I also added a quick explanation on the generalization to locally compact abelian groups (details in the notes on Pontryagin duality) and how non-commutative geometry arrises from a group-ring',
    link: '././assets/pdfs/blogs/some_harmonic_analysis.pdf',
    published: '2026-01-12',
    domain: 'maths',
    topic: 'algebra',
    alsoTopics: ['analysis'],
    level: 'deep',
  },
  {
    name: 'Representation of SL2: L-packets',
    desc: "This post following the paper 'Representations of SL2(F)' by Guy Henniart and Marie-France Vignéras explores the representation theory of $SL_2(F)$ through the lens of restriction from $GL_2(F)$. While the Local Langlands correspondence is a bijection for the general linear group, the restriction to the special linear group creates L-packets -- finite fibers of indistinguishable representations. Using Clifford Theory adapted for locally profinite groups and the uniqueness of Whittaker models, the paper goes over why these packets have cardinalities of 1, 2, or 4, and alludes to their representation theory information",
    link: '././assets/pdfs/blogs/langlands_for_sl2.pdf',
    published: '2025-11-26',
    domain: 'maths',
    topic: 'number-theory',
    alsoTopics: ['algebra'],
    level: 'deep',
  },
  {
    name: 'Galois Theory - Why use Field Extensions',
    desc: 'This is an extract from EYNTKA algebra of me fleshing out my intuition on why field extensions are the natural setting to study the symmetries of the roots of polynomials.',
    link: '././assets/pdfs/blogs/galois_theory_intuition_behind_field_extensions.pdf',
    published: '2025-09-26',
    domain: 'maths',
    topic: 'algebra',
    alsoTopics: ['foundations'],
    level: 'mid',
  },
  {
    name: 'Complex Analysis: What is it?',
    desc: 'I have struggled with how to perceive complex analysis for awhile, and I finally landed on an intuition that is satisfying. This article expands on the following: "Complex analysis is the analytification of polynomials, giving us the tools to form a link between Algebra and Analysis"',
    link: '././assets/pdfs/blogs/what_is_complex.pdf',
    published: '2025-02-20',
    domain: 'maths',
    topic: 'analysis',
    alsoTopics: ['foundations'],
    level: 'mid',
  },
  {
    name: 'Reserach in Algebraic Geometry',
    desc: 'An extract from the end of EYTNKA algebra covering the areas of algebraic geometry research that peeked my interset. Goes over a quick description and resources to understand the math for the statment (either my own or from others)',
    link: '././assets/pdfs/blogs/areas_of_algebraic_geoemtry_reserach.pdf',
    published: '2025-07-29',
    domain: 'maths',
    topic: 'geometry',
    level: 'deep',
  },
  {
    name: 'Clock Arithmetic and some Applications',
    desc: 'This is a quick expository article requiring no mathematical background that aims to teach the basic notion of modular arithmetic, or "clock arithmetic," to my friends to whom I love giving math riddles. I also added a quick survey of some uses of modular arithmetic as well as some surprising connections between prime numbers.',
    link: '././assets/pdfs/blogs/clock_arithmetic.pdf',
    published: '2025-06-24',
    domain: 'maths',
    topic: 'number-theory',
    level: 'open',
  },

  {
    name: "Towards Langlands's Reciprocity",
    desc: 'Many may have heard the tantalizing claim that quadratic reciprocity is the simplest version of Langlands\'s reciprocity. In this quick article, I give an overview of the build-up towards it by going through Artin\'s reciprocity, computing the Artin map on a quadratic field and a coefficient of a modular form along the way.',
    link: '././assets/pdfs/blogs/from_quadratic_to_langlands.pdf',
    published: '2024-12-16',
    domain: 'maths',
    topic: 'number-theory',
    level: 'deep',
  },
  {
    name: 'Comparing Schemes and Manifolds',
    desc: 'An extract from EYNTKA Algebraic Geometry that lists in bullet-point format some differences between schemes and manifolds, to get a better sense of the similarities and differences between the geometries they represent.',
    link: '././assets/pdfs/blogs/differences_between_schemes_and_manifolds.pdf',
    published: '2025-08-04',
    domain: 'maths',
    topic: 'geometry',
    level: 'deep',
  },

  // ─── Planned ────────────────────────────────────────────────────────────────
  // Hidden from visitors until the lock at the bottom of /blog is opened.
  // `planned` controls visibility only; it says nothing about whether a PDF
  // exists. An entry with a `link` is readable once unlocked, one without shows
  // "not yet written" and needs `intendedDate` to sort into the stream.
  //
  // To publish: delete `planned` (and `intendedDate`), adding `link` first if
  // there was none.
  //
  // This block replaces the commented-out entries that used to live at the
  // bottom of this file. Commenting an entry out hid it from me as well as from
  // visitors, and cost the four below their place in the stream.
  {
    name: 'Thoughts on Epistemology',
    desc: 'A draft that has sat uncompiled for a while — what I actually think knowledge is, written for someone who has not read any philosophy. Source at ~/Documents/academic/blogs/thoughts_on_epistemology.',
    domain: 'philosophy',
    topic: 'epistemology',
    level: 'open',
    planned: true,
    intendedDate: '2026-06-01',
  },
  {
    name: 'Kant and Modern Mathematics',
    desc: 'Whether the synthetic a priori survives contact with non-Euclidean geometry and formal logic, and what Kant was actually right about. Source at ~/Documents/academic/blogs/kant_and_modern_mathematic.',
    domain: 'philosophy',
    topic: 'phil-of-maths',
    level: 'mid',
    planned: true,
    intendedDate: '2026-05-14',
  },
  {
    name: "Alien's Perspective on Analysis",
    desc: "We typically build analysis from the bottom up (N -> Q -> R -> C). But in many ways it is more natural to do (N -> Q -> C), and then try to find how R would naturally appear. This post explores an 'Alien' perspective where the algebraic closure of Q is the natural universe and R a derived substructure found via Galois involutions; this shift tries to explain why real analysis is 'flexible' (allowing bump functions) while complex analysis is 'rigid', and characterizes R as the unique 'Cohesive-Connected Field' among all completions of Q",
    link: '././assets/pdfs/blogs/alien_perspective_on_analysis.pdf',
    published: '2026-02-23',
    domain: 'maths',
    topic: 'analysis',
    alsoTopics: ['foundations'],
    level: 'deep',
    planned: true,
  },
  {
    name: 'The Difficulty in the Collatz Conjecture',
    desc: 'While talking to non-math friends about my interest in number theory, the Collatz Conjecture seems to always be on the tip of their tongues. This paper goes over a probablistic distribution that can be put on the representation of natural numbers that is stable when extending the number to the 2-adics, and is almost stable over natural numbers. This allows you to define interesting functionals and find their expected value, reformulating the conjecture into a problem about those functionals being negative in expectation.',
    link: '././assets/pdfs/blogs/Conjecture_old.pdf',
    published: '2024-12-01',
    domain: 'maths',
    topic: 'number-theory',
    level: 'open',
    planned: true,
  },
];
