import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import {
  BlogManifest,
  BlogPost,
  LEVEL_LABEL,
  LEVEL_SHORT,
} from '../interfaces/blog.model';
import { BLOG_POSTS, DOMAIN_LABELS, TOPIC_LABELS } from '../components/blog/blog-posts';

// Page count + compile date per blog PDF, written by scripts/gen-blog-manifest.js
// from the files themselves. See that script for why this is not hand-authored.
const MANIFEST_URL = 'assets/pdfs/blogs/manifest.json';

const basename = (link: string): string => link.split('/').pop() ?? '';

@Injectable({ providedIn: 'root' })
export class BlogCatalogService {
  constructor(private http: HttpClient) {}

  // A missing manifest is survivable — every entry just loses its date and
  // length — so it must not take the page down with it.
  private manifest$ = this.http.get<BlogManifest>(MANIFEST_URL).pipe(
    catchError(() => of({} as BlogManifest)),
    shareReplay(1),
  );

  // Every authored post, merged with its PDF's metadata and ordered newest
  // first. Posts whose PDF is missing from the manifest keep their place by
  // falling to the end rather than being dropped: the build check is what
  // catches a broken link, and a silent disappearance here would hide it.
  //
  // Order comes from `published`, never from the compile date. Sorting on the
  // compile date made the stream reshuffle itself every time a PDF was rebuilt,
  // which is not what a reader means by a date on an article.
  //
  // Planned entries are included. Hiding them is the component's job, because
  // the unlock state lives there — and because everything the page derives
  // (domain counts, which filters render, year headings) has to be computed
  // after that filter, not before it.
  readonly posts$: Observable<BlogPost[]> = this.manifest$.pipe(
    map((manifest) =>
      BLOG_POSTS.map((entry) => {
        const file = entry.link ? basename(entry.link) : '';
        const meta = file ? manifest[file] : undefined;
        // A planned entry with no PDF has only `intendedDate` to place it.
        const published = entry.published ?? entry.intendedDate;
        // The authored `updated` wins over the compile date, so a rebuild that
        // changed nothing can be told from a revision that did.
        const lastTouched = entry.updated ?? meta?.updated ?? undefined;
        return {
          ...entry,
          file,
          domainLabel: DOMAIN_LABELS[entry.domain] ?? entry.domain,
          topicLabel: TOPIC_LABELS[entry.topic] ?? entry.topic,
          alsoLabels: (entry.alsoTopics ?? []).map((t) => TOPIC_LABELS[t] ?? t),
          levelLabel: LEVEL_LABEL[entry.domain][entry.level],
          levelShort: LEVEL_SHORT[entry.domain][entry.level],
          published,
          updatedNote:
            lastTouched && published && lastTouched > published ? lastTouched : undefined,
          pages: meta?.pages ?? undefined,
          readingMinutes: meta?.readingMinutes ?? undefined,
        };
      }).sort((a, b) => (b.published ?? '').localeCompare(a.published ?? '')),
    ),
    shareReplay(1),
  );
}
