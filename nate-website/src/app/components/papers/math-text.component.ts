import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Render authored prose that contains TeX between $…$ (inline) and $$…$$
// (display).
//
// KaTeX is pulled in with a dynamic import rather than a top-level one so it
// stays out of the initial bundle: 76 KB gzipped is not worth spending on every
// visitor to every route for a feature only /papers uses. Until it resolves the
// component shows the raw authored string, which is readable prose with dollar
// signs in it rather than a blank space.
//
// The stylesheet is global (angular.json), not a component style: Angular's
// emulated encapsulation rewrites selectors and breaks KaTeX's, and the escape
// hatch — ViewEncapsulation.None — leaks the rules globally anyway.
type KatexModule = { renderToString(tex: string, opts?: Record<string, unknown>): string };
let katexPromise: Promise<KatexModule> | null = null;

function loadKatex(): Promise<KatexModule> {
  if (!katexPromise) katexPromise = import('katex').then((m) => (m as any).default ?? m);
  return katexPromise;
}

// $$…$$ first so a display block is never mistaken for two inline spans.
// Two copies on purpose: `test` on a /g regex advances lastIndex between calls
// and would alternate true/false across change-detection passes.
const SEGMENT = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
const HAS_MATH = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/;

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

@Component({
  selector: 'app-math-text',
  template: `<span class="math-text" [innerHTML]="html"></span>`,
  styles: [
    `
      .math-text {
        display: inline;
      }
      /* KaTeX display blocks are block-level; give them the breathing room the
         surrounding paragraph's line-height does not. */
      ::ng-deep .math-text .katex-display {
        margin: 1.1em 0;
      }
    `,
  ],
})
export class MathTextComponent implements OnChanges {
  @Input() text = '';

  html: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  async ngOnChanges(): Promise<void> {
    // Plain text first, so the abstract is legible before KaTeX lands.
    this.html = this.sanitizer.bypassSecurityTrustHtml(escapeHtml(this.text));
    if (!HAS_MATH.test(this.text)) return;

    const katex = await loadKatex();
    const rendered = this.text
      .split(SEGMENT)
      .map((part) => {
        const display = part.startsWith('$$') && part.endsWith('$$') && part.length > 4;
        const inline = !display && part.startsWith('$') && part.endsWith('$') && part.length > 2;
        // Everything that is not a math span is authored prose and must be
        // escaped by us — only KaTeX's own output is trusted HTML.
        if (!display && !inline) return escapeHtml(part);
        const tex = part.slice(display ? 2 : 1, display ? -2 : -1);
        return katex.renderToString(tex, { throwOnError: false, displayMode: display });
      })
      .join('');
    this.html = this.sanitizer.bypassSecurityTrustHtml(rendered);
  }
}
