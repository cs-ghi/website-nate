import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Program, STATUS_LABEL } from 'src/app/interfaces/programming.model';
import { programmingArray } from './programming.component';

@Component({
    selector: 'app-programming-detail',
    templateUrl: './programming-detail.component.html',
    styleUrls: ['./programming-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProgrammingDetailComponent implements OnInit {
  program?: Program;
  copied = false;
  readonly statusLabel = STATUS_LABEL;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.program = programmingArray.find((p) => p.slug === slug);
      // Unknown slug (stale link, typo) -> back to the gallery.
      if (!this.program) this.router.navigate(['/programming']);
    });
  }

  get installLang(): string {
    // Lua lazy.nvim specs start with a brace; everything else is shell.
    return this.program?.install?.trimStart().startsWith('{') ? 'lua' : 'sh';
  }

  copyInstall(): void {
    if (!this.program?.install) return;
    navigator.clipboard?.writeText(this.program.install);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1500);
  }

  back(): void {
    this.router.navigate(['/programming']);
  }
}
