import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BlogLevel, BlogPost, LEVEL_LABEL, LEVEL_ORDER } from 'src/app/interfaces/blog.model';
import { BLOG_TOPICS } from './blog-posts';
import { BlogCatalogService } from 'src/app/services/blog-catalog.service';
import { fuzzyScore } from 'src/app/utils/fuzzy-score';

export type BlogSort = 'newest' | 'oldest' | 'shortest' | 'title';

const SORTS: { key: BlogSort; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'shortest', label: 'Shortest' },
  { key: 'title', label: 'A–Z' },
];

// Fuzzy on the title, substring on the body — same weighting the books page
// uses, so a title match always outranks a description mention.
function entryScore(query: string, post: BlogPost): number {
  const nameScore = fuzzyScore(query, post.name);
  if (nameScore > 0) return nameScore + 1000;
  return post.desc.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
}

@Component({
  selector: 'app-blogs',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  allPosts: BlogPost[] = [];
  visiblePosts: BlogPost[] = [];

  query = '';
  activeTopic = 'all';
  activeLevel: BlogLevel | 'all' = 'all';
  sort: BlogSort = 'newest';

  readonly topics = BLOG_TOPICS;
  readonly sorts = SORTS;

  constructor(private router: Router, private catalog: BlogCatalogService) {}

  ngOnInit(): void {
    this.catalog.posts$.subscribe((posts) => {
      this.allPosts = posts;
      this.recompute();
    });
  }

  // Press "/" anywhere on the page to jump to the search box, matching /books.
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
    const el = event.target as HTMLElement | null;
    if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable) return;
    event.preventDefault();
    this.searchInput?.nativeElement.focus();
  }

  // The lead card. Only the unfiltered, newest-first view has a "latest post" —
  // once the reader is searching or filtering, the top hit is not the latest
  // anything, and promoting it would misrepresent it.
  get leadPost(): BlogPost | null {
    return this.isDefaultView ? this.visiblePosts[0] ?? null : null;
  }

  get gridPosts(): BlogPost[] {
    return this.isDefaultView ? this.visiblePosts.slice(1) : this.visiblePosts;
  }

  private get isDefaultView(): boolean {
    return (
      !this.query.trim() &&
      this.activeTopic === 'all' &&
      this.activeLevel === 'all' &&
      this.sort === 'newest'
    );
  }

  // Levels actually present in the catalogue, easiest first — derived so a level
  // with no post never gets a dead chip.
  get levelChips(): { key: BlogLevel; label: string }[] {
    const present = new Set(this.allPosts.map((p) => p.level));
    return LEVEL_ORDER.filter((l) => present.has(l)).map((l) => ({
      key: l,
      label: LEVEL_LABEL[l],
    }));
  }

  // Posts surviving the search + level, ignoring the topic chips, so each chip's
  // count reflects what clicking it would actually show.
  private get topicIndependent(): BlogPost[] {
    return this.filter(this.allPosts, { withTopic: false });
  }

  // A post counts toward its primary topic and any secondary one it declares —
  // the chip is "posts that touch this", which is what a reader picking a
  // subject means.
  countFor(key: string): number {
    return this.topicIndependent.filter((p) => this.inTopic(p, key)).length;
  }

  private inTopic(post: BlogPost, key: string): boolean {
    return key === 'all' || post.topic === key || (post.alsoTopics ?? []).includes(key);
  }

  private filter(posts: BlogPost[], opts: { withTopic: boolean }): BlogPost[] {
    const q = this.query.trim();
    let out = posts.filter(
      (p) =>
        (this.activeLevel === 'all' || p.level === this.activeLevel) &&
        (!opts.withTopic || this.inTopic(p, this.activeTopic)),
    );
    if (q) {
      out = out
        .map((p) => ({ p, score: entryScore(q, p) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.p);
    }
    return out;
  }

  // Search relevance outranks the sort control: if someone typed a query, the
  // best match belongs first regardless of which sort is selected.
  private order(posts: BlogPost[]): BlogPost[] {
    if (this.query.trim()) return posts;
    const by = [...posts];
    switch (this.sort) {
      case 'oldest':
        return by.sort((a, b) => (a.updated ?? '').localeCompare(b.updated ?? ''));
      case 'shortest':
        return by.sort((a, b) => (a.pages ?? Infinity) - (b.pages ?? Infinity));
      case 'title':
        return by.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return by.sort((a, b) => (b.updated ?? '').localeCompare(a.updated ?? ''));
    }
  }

  private recompute(): void {
    this.visiblePosts = this.order(this.filter(this.allPosts, { withTopic: true }));
  }

  setTopic(key: string): void {
    this.activeTopic = key;
    this.recompute();
  }

  setLevel(key: BlogLevel | 'all'): void {
    this.activeLevel = key;
    this.recompute();
  }

  setSort(key: BlogSort): void {
    this.sort = key;
    this.recompute();
  }

  onQueryChange(): void {
    this.recompute();
  }

  clearSearch(): void {
    this.query = '';
    this.recompute();
  }

  // The blurb under a topic heading is orienting when one topic is selected and
  // ten repetitions of noise when none is.
  get activeTopicBlurb(): string | null {
    return this.topics.find((t) => t.key === this.activeTopic)?.blurb ?? null;
  }

  // Name whichever filter is actually responsible for the empty page rather than
  // a generic "no results".
  get emptyStateMessage(): string {
    const q = this.query.trim();
    const topic = this.topics.find((t) => t.key === this.activeTopic)?.label;
    const level = this.levelChips.find((l) => l.key === this.activeLevel)?.label;
    const article = level && /^[aeiou]/i.test(level) ? 'an' : 'a';
    const parts = [
      q ? `matching "${q}"` : '',
      topic ? `in ${topic}` : '',
      level ? `written for ${article} ${level.toLowerCase()} reader` : '',
    ].filter(Boolean);
    return `No posts ${parts.join(' ')}.`;
  }

  get hasFilters(): boolean {
    return !!this.query.trim() || this.activeTopic !== 'all' || this.activeLevel !== 'all';
  }

  resetFilters(): void {
    this.query = '';
    this.activeTopic = 'all';
    this.activeLevel = 'all';
    this.recompute();
  }

  trackByFile(_: number, post: BlogPost): string {
    return post.file;
  }

  // Open in the site's own PDF viewer rather than dumping the reader into the
  // browser's — same as /books and /notes. `source` drives its back link.
  open(post: BlogPost): void {
    this.router.navigate(['/pdf-viewer'], {
      queryParams: { src: post.link, name: post.name, source: 'blog' },
    });
  }
}
