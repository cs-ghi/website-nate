import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DictionaryService, DictionaryResponse, LanguageOutput } from '../../services/dictionary.service';
import { AudioService } from '../../services/audio.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-dictionary',
    templateUrl: './dictionary.component.html',
    styleUrls: ['./dictionary.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-10px)', maxHeight: '0px', marginBottom: '0' }),
                animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)', maxHeight: '500px', marginBottom: '1.5rem' }))
            ]),
            transition(':leave', [
                animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)', maxHeight: '0px', marginBottom: '0' }))
            ])
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('500ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DictionaryComponent implements OnInit {
  searchQuery = '';
  loading = false;
  result: DictionaryResponse | null = null;
  error: string | null = null;

  japaneseOutputs: LanguageOutput[] = [];
  chineseOutputs: LanguageOutput[] = [];

  maxResults = 5;  // Configurable
  showAllJapanese = false;
  showAllChinese = false;

  copiedIndex: string | null = null;

  constructor(
    private dictionaryService: DictionaryService,
    private audioService: AudioService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      await this.dictionaryService.initialize();
    } catch (err) {
      this.error = 'Failed to load dictionary database';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  search() {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.japaneseOutputs = [];
    this.chineseOutputs = [];
    this.showAllJapanese = false;
    this.showAllChinese = false;

    try {
      this.result = this.dictionaryService.search(this.searchQuery, this.maxResults);

      if (this.result) {
        // Separate outputs by language
        for (const output of this.result.outputs) {
          if (output.language === 'ja') {
            this.japaneseOutputs.push(output);
          } else if (output.language === 'zh') {
            this.chineseOutputs.push(output);
          }
        }
      }
    } catch (err) {
      this.error = 'Search failed';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  playAudio(output: LanguageOutput) {
    if (output.audio) {
      this.audioService.speak(output.audio.text, output.audio.locale);
    }
  }

  getMetadata(output: LanguageOutput): string[] {
    const meta = output.meta;
    if (!meta) return [];

    const items: string[] = [];

    // Add rank indicator
    if (output.rank && output.rank > 0) {
      if (output.rank <= 100) {
        items.push('★ Common');
      } else if (output.rank <= 1000) {
        items.push(`Rank: ${output.rank}`);
      }
    }

    if (meta.jlpt_level) {
      items.push(`JLPT: ${meta.jlpt_level}`);
    }
    if (meta.hsk_level) {
      items.push(`HSK: ${meta.hsk_level}`);
    }
    if (meta.stroke_count) {
      items.push(`${meta.stroke_count} strokes`);
    }
    if (meta.traditional) {
      items.push(`Traditional: ${meta.traditional}`);
    }

    return items;
  }

  getVisibleOutputs(outputs: LanguageOutput[], showAll: boolean): LanguageOutput[] {
    if (showAll || outputs.length <= 3) {
      return outputs;
    }
    return outputs.slice(0, 3);
  }

  getRemainingCount(outputs: LanguageOutput[], showAll: boolean): number {
    if (showAll || outputs.length <= 3) {
      return 0;
    }
    return outputs.length - 3;
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  async copyToClipboard(text: string, index: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.copiedIndex = index;
      // Reset after 1.5 seconds
      setTimeout(() => {
        this.copiedIndex = null;
      }, 1500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }

  isCopied(index: string): boolean {
    return this.copiedIndex === index;
  }

  clearSearch() {
    this.searchQuery = '';
    this.result = null;
    this.japaneseOutputs = [];
    this.chineseOutputs = [];
    this.error = null;
    this.showAllJapanese = false;
    this.showAllChinese = false;
  }
}
