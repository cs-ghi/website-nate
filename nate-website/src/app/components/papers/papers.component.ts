import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paper, STATUS_SECTIONS } from 'src/app/interfaces/papers.model';
import { PaperCatalogService } from 'src/app/services/paper-catalog.service';

export interface PaperSection {
  label: string;
  blurb: string;
  papers: Paper[];
}

@Component({
  selector: 'app-papers',
  templateUrl: './papers.component.html',
  styleUrls: ['./papers.component.scss'],
})
export class PapersComponent implements OnInit {
  sections: PaperSection[] = [];

  // Which rows have their abstract expanded, by slug. Expanding does not
  // navigate — the full record is one click deeper, at /papers/:slug.
  private open = new Set<string>();

  // Which row's BibTeX was last copied, for the transient "copied" label.
  copiedSlug: string | null = null;

  constructor(private router: Router, private catalog: PaperCatalogService) {}

  ngOnInit(): void {
    this.catalog.papers$.subscribe((papers) => {
      // Grouped by status rather than filtered by it: with two or three papers
      // a chip row would be more chrome than content, and a reader (or a hiring
      // committee) expects a publication list to read top-down.
      this.sections = STATUS_SECTIONS.map((s) => ({
        label: s.label,
        blurb: s.blurb,
        papers: papers.filter((p) => s.keys.includes(p.status)),
      })).filter((s) => s.papers.length);
    });
  }

  isOpen(paper: Paper): boolean {
    return this.open.has(paper.slug);
  }

  toggleAbstract(paper: Paper, event: MouseEvent): void {
    event.stopPropagation();
    if (this.open.has(paper.slug)) this.open.delete(paper.slug);
    else this.open.add(paper.slug);
  }

  openPaper(paper: Paper): void {
    this.router.navigate(['/papers', paper.slug]);
  }

  read(paper: Paper, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/pdf-viewer'], {
      queryParams: { src: paper.pdfUrl, name: paper.title, source: 'papers' },
    });
  }

  copyBibtex(paper: Paper, event: MouseEvent): void {
    event.stopPropagation();
    navigator.clipboard?.writeText(paper.bibtex);
    this.copiedSlug = paper.slug;
    setTimeout(() => (this.copiedSlug = null), 1500);
  }

  stop(event: MouseEvent): void {
    event.stopPropagation();
  }

  trackBySlug(_: number, paper: Paper): string {
    return paper.slug;
  }
}
