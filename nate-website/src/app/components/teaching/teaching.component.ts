import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Course } from 'src/app/interfaces/teaching.model';
import { COURSES } from './teaching.data';

@Component({
    selector: 'app-teaching',
    templateUrl: './teaching.component.html',
    styleUrls: ['./teaching.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TeachingComponent {
  readonly courses = COURSES;

  clipCount(c: Course): number {
    return c.chapters.reduce(
      (n, ch) => n + ch.groups.reduce((m, g) => m + g.clips.length, 0), 0);
  }
}
