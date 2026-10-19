import {
  Component, OnInit, ChangeDetectionStrategy, ElementRef, QueryList, ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, TeachingClip } from 'src/app/interfaces/teaching.model';
import { COURSES } from './teaching.data';

// Fullscreen entry points differ by browser. requestFullscreen is standard
// (desktop, and iPad since Safari 16.4), webkitRequestFullscreen is older
// Safari, and webkitEnterFullscreen is the only option on iPhone.
interface FullscreenCapable {
  requestFullscreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => void;
  webkitEnterFullscreen?: () => void;
}

@Component({
    selector: 'app-teaching-course',
    templateUrl: './teaching-course.component.html',
    styleUrls: ['./teaching-course.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TeachingCourseComponent implements OnInit {
  course?: Course;
  // Clips that have been played: they swap the poster overlay for native controls.
  readonly started = new Set<string>();

  @ViewChildren('video') videos!: QueryList<ElementRef<HTMLVideoElement>>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.course = COURSES.find((c) => c.slug === params.get('slug'));
      // Unknown slug (stale link, typo) -> back to the course list.
      if (!this.course) this.router.navigate(['/teaching']);
    });
  }

  // Tap a clip: stop any other clip, go full screen, play. Both the fullscreen
  // request and play() must happen inside the tap, or iOS refuses them.
  present(video: HTMLVideoElement, clip: TeachingClip): void {
    this.started.add(clip.src);
    this.videos.forEach((ref) => {
      if (ref.nativeElement !== video) ref.nativeElement.pause();
    });
    if (video.ended) video.currentTime = 0;

    const v = video as unknown as FullscreenCapable;
    if (v.requestFullscreen) {
      v.requestFullscreen().catch(() => {});
    } else if (v.webkitRequestFullscreen) {
      v.webkitRequestFullscreen();
    } else if (v.webkitEnterFullscreen) {
      try { v.webkitEnterFullscreen(); } catch { /* metadata not loaded yet: play inline */ }
    }
    video.play().catch(() => {});
  }

  duration(seconds: number): string {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }
}
