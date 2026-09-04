import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { HOST_LABEL, Paper } from 'src/app/interfaces/papers.model';
import { PaperCatalogService } from 'src/app/services/paper-catalog.service';

@Component({
    selector: 'app-paper-detail',
    templateUrl: './paper-detail.component.html',
    styleUrls: ['./paper-detail.component.scss'],
    standalone: false
})
export class PaperDetailComponent implements OnInit {
  paper?: Paper;
  copied = false;
  readonly hostLabel = HOST_LABEL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalog: PaperCatalogService,
    private title: Title,
    private meta: Meta,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.catalog.papers$.subscribe((papers) => {
        this.paper = papers.find((p) => p.slug === slug);
        // Unknown slug (stale link, typo) -> back to the list.
        if (!this.paper) {
          this.router.navigate(['/papers']);
          return;
        }
        this.setMeta(this.paper);
      });
    });
  }

  // Citation metadata for link previews and any crawler that runs JavaScript.
  // Google Scholar's does not, which is what the build-time static stub in
  // PAPERS-SECTION-PLAN.md phase 3 is for; these tags are the runtime half.
  private setMeta(paper: Paper): void {
    this.title.setTitle(`${paper.title} — Nathanael Srawley`);
    const tags: [string, string][] = [
      ['citation_title', paper.title],
      ['citation_publication_date', paper.current.date.replace(/-/g, '/')],
      ['citation_pdf_url', new URL(paper.pdfUrl.replace(/^\.\/\.\//, ''), location.origin).href],
      ['description', paper.summary ?? paper.title],
    ];
    if (paper.arxiv) tags.push(['citation_arxiv_id', paper.arxiv.id]);
    if (paper.venue?.doi) tags.push(['citation_doi', paper.venue.doi]);
    for (const [name, content] of tags) this.meta.updateTag({ name, content });
    // One citation_author tag per author is the convention, not a joined list.
    this.meta.removeTag("name='citation_author'");
    for (const author of paper.authors) {
      this.meta.addTag({ name: 'citation_author', content: author });
    }
  }

  read(): void {
    if (!this.paper) return;
    this.router.navigate(['/pdf-viewer'], {
      queryParams: { src: this.paper.pdfUrl, name: this.paper.title, source: 'papers' },
    });
  }

  copyBibtex(): void {
    if (!this.paper) return;
    navigator.clipboard?.writeText(this.paper.bibtex);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1500);
  }

  back(): void {
    this.router.navigate(['/papers']);
  }
}
