import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogDomain, BlogPost } from 'src/app/interfaces/blog.model';
import { BLOG_DOMAINS } from './blog-posts';
import { BlogCatalogService } from 'src/app/services/blog-catalog.service';

// ─── Planned-post unlock ─────────────────────────────────────────────────────
// Same scheme as the admin lock on /books. To change the password, run this in
// a browser console and paste the result below:
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'))
//     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
//
// This is obscurity, not security: the hash and the planned entries themselves
// both ship in the JS bundle. It hides drafts from a visitor, not from anyone
// who opens devtools — which is the right level for "don't show my unfinished
// list".
const PASSWORD_HASH = '57a0af3b7fdd6aa6f0e3e9b4c3f2d37cdc11b0087f22d4dd8071869da5724935';
const AUTH_KEY = 'blog_planned_auth';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// A year heading plus the entries filed under it. Built in the component rather
// than with a template pipe so the grouping runs once per filter change instead
// of once per change-detection pass.
export interface BlogYear {
  year: string;
  posts: BlogPost[];
}

@Component({
    selector: 'app-blogs',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    standalone: false
})
export class BlogComponent implements OnInit {
  private allPosts: BlogPost[] = [];

  years: BlogYear[] = [];
  activeDomain: BlogDomain | 'all' = 'all';
  activeTopic = 'all';

  unlocked = false;
  showPasswordForm = false;
  passwordInput = '';
  authError = false;

  constructor(private router: Router, private catalog: BlogCatalogService) {}

  ngOnInit(): void {
    this.unlocked = sessionStorage.getItem(AUTH_KEY) === 'true';
    this.catalog.posts$.subscribe((posts) => {
      this.allPosts = posts;
      this.recompute();
    });
  }

  // Every derived thing on the page reads from here, never from `allPosts`.
  // A locked visitor must not be shown a "Philosophy" filter that yields
  // nothing — that advertises exactly what the lock is hiding.
  private get visible(): BlogPost[] {
    return this.unlocked ? this.allPosts : this.allPosts.filter((p) => !p.planned);
  }

  // ── Filters ────────────────────────────────────────────────────────────────

  // Tier 1. Only domains with something visible behind them; a domain you have
  // not written for yet must not leave a dead word on the line.
  get domainChips(): { key: BlogDomain; label: string }[] {
    return BLOG_DOMAINS.filter((d) => this.visible.some((p) => p.domain === d.key)).map((d) => ({
      key: d.key,
      label: d.label,
    }));
  }

  // Tier 2, scoped to the selected domain. Hidden entirely with fewer than two
  // topics, where the row would be a single button that does nothing.
  get topicChips(): { key: string; label: string }[] {
    const domain = BLOG_DOMAINS.find((d) => d.key === this.activeDomain);
    if (!domain) return [];
    const chips = domain.topics
      .filter((t) => this.visible.some((p) => this.inDomain(p) && this.inTopic(p, t.key)))
      .map((t) => ({ key: t.key, label: t.label }));
    return chips.length > 1 ? chips : [];
  }

  get activeTopicBlurb(): string | null {
    if (this.activeTopic === 'all') return null;
    return (
      BLOG_DOMAINS.flatMap((d) => d.topics).find((t) => t.key === this.activeTopic)?.blurb ?? null
    );
  }

  // The domain word only earns its place in the rail while the feed is mixed.
  get showDomainInRail(): boolean {
    return this.activeDomain === 'all';
  }

  private inDomain(post: BlogPost): boolean {
    return this.activeDomain === 'all' || post.domain === this.activeDomain;
  }

  private inTopic(post: BlogPost, key: string): boolean {
    return key === 'all' || post.topic === key || (post.alsoTopics ?? []).includes(key);
  }

  setDomain(key: BlogDomain | 'all'): void {
    this.activeDomain = key;
    this.activeTopic = 'all';
    this.recompute();
  }

  setTopic(key: string): void {
    this.activeTopic = key;
    this.recompute();
  }

  private recompute(): void {
    const shown = this.visible.filter((p) => this.inDomain(p) && this.inTopic(p, this.activeTopic));

    // `posts$` is already newest-first, so a linear pass gives year groups in
    // order without re-sorting. Entries with no date at all land under an
    // "Undated" heading rather than silently joining the oldest year.
    const years: BlogYear[] = [];
    for (const post of shown) {
      const year = post.published ? post.published.slice(0, 4) : 'Undated';
      const last = years[years.length - 1];
      if (last && last.year === year) last.posts.push(post);
      else years.push({ year, posts: [post] });
    }
    this.years = years;
  }

  get isEmpty(): boolean {
    return !this.years.length;
  }

  get emptyStateMessage(): string {
    const domain = this.domainChips.find((d) => d.key === this.activeDomain)?.label;
    const topic = this.topicChips.find((t) => t.key === this.activeTopic)?.label;
    return `Nothing in ${topic ?? domain ?? 'the archive'} yet.`;
  }

  trackByYear(_: number, group: BlogYear): string {
    return group.year;
  }

  trackByPost(_: number, post: BlogPost): string {
    return post.file || post.name;
  }

  // Open in the site's own PDF viewer rather than dumping the reader into the
  // browser's — same as /books and /notes. `source` drives its back link.
  // A planned entry with no PDF has nothing to open.
  open(post: BlogPost): void {
    if (!post.link) return;
    this.router.navigate(['/pdf-viewer'], {
      queryParams: { src: post.link, name: post.name, source: 'blog' },
    });
  }

  // ── Unlock ─────────────────────────────────────────────────────────────────

  toggleLock(): void {
    if (this.unlocked) {
      this.unlocked = false;
      sessionStorage.removeItem(AUTH_KEY);
      this.showPasswordForm = false;
      // The active filter may have been a domain that only planned posts live
      // in; fall back to everything rather than render an empty page.
      if (!this.domainChips.some((d) => d.key === this.activeDomain)) this.setDomain('all');
      else this.recompute();
    } else {
      this.showPasswordForm = !this.showPasswordForm;
      this.authError = false;
      this.passwordInput = '';
    }
  }

  async submitPassword(): Promise<void> {
    if ((await sha256(this.passwordInput)) === PASSWORD_HASH) {
      this.unlocked = true;
      sessionStorage.setItem(AUTH_KEY, 'true');
      this.showPasswordForm = false;
      this.authError = false;
      this.passwordInput = '';
      this.recompute();
    } else {
      this.authError = true;
      this.passwordInput = '';
    }
  }

  onPasswordKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submitPassword();
    if (event.key === 'Escape') this.showPasswordForm = false;
  }
}
