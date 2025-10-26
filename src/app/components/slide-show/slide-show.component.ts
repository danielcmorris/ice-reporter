import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbSlideLike } from '../../models/image';

// -------------------------------------------------------------
// NgBootstrapSlideshowComponent (Angular standalone)
// -------------------------------------------------------------
// Uses ng-bootstrap's <ngb-carousel> for a11y-friendly, touch-enabled
// slideshows with indicators and controls.
//
// Features
// - Accepts string[] or { src, alt?, caption?, header? }[]
// - Autoplay with configurable interval (ms)
// - Wrap/loop, keyboard nav, pause-on-hover
// - Show/hide arrows & indicators
// - Lazy-loading images
// - Pure ng-bootstrap; no extra deps
// -------------------------------------------------------------
// Install peer deps if needed:
//   npm i @ng-bootstrap/ng-bootstrap
//   // Ensure you use Bootstrap CSS in your global styles
// -------------------------------------------------------------
// Usage:
// <app-ngb-slideshow
//   [images]="imageList"
//   [interval]="5000"
//   [wrap]="true"
//   [keyboard]="true"
//   [pauseOnHover]="true"
//   [showNavigationArrows]="true"
//   [showNavigationIndicators]="true"
//   style="max-width: 900px; display:block; margin:auto"
// ></app-ngb-slideshow>
//
// imageList = [
//   'https://picsum.photos/id/1015/1200/800',
//   { src: 'https://picsum.photos/id/1021/1200/800', alt: 'Forest', caption: 'Misty Forest', header: 'Slide 2' },
//   'https://picsum.photos/id/1035/1200/800'
// ];
// -------------------------------------------------------------


@Component({
  selector: 'app-ngb-slideshow',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <ngb-carousel
    [interval]="interval"
    [wrap]="wrap"
    [keyboard]="keyboard"
    [pauseOnHover]="pauseOnHover"
    [showNavigationArrows]="showNavigationArrows"
    [showNavigationIndicators]="showNavigationIndicators"
    [pauseOnFocus]="pauseOnFocus"
    [animation]="animation"
    [activeId]="activeId ?? ''"
    (slide)="onSlide($event)"
  >
    <ng-template ngbSlide *ngFor="let s of normalized; let i = index" [id]="'slide-' + i">
      <figure class="m-0 position-relative">
        <img class="w-100 d-block" [src]="s.src" [alt]="s.alt || ''" loading="lazy" decoding="async"/>
        <figcaption *ngIf="s.caption || s.header" 
          class="carousel-caption overlay-caption d-none d-md-block text-start">
          <h5 *ngIf="s.header">{{ s.header }}</h5>
          <p *ngIf="s.caption">{{ s.caption }}</p>
        </figcaption>
      </figure>
    </ng-template>
  </ngb-carousel>
  `,
  styles: [`
  :host { display:block; }
  img { user-select:none; -webkit-user-drag:none; }
  .overlay-caption {
  background: rgba(255, 255, 255, 0.7); /* light, semi-transparent */
  color: #000; /* black text */
  padding: 1rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(5px); /* optional, gives a nice frosted look */
}

  `]
})
export class NgBootstrapSlideshowComponent {
  @Input() images: NgbSlideLike[] = [];
  @Input() interval = 5000; // ms; set 0 to disable autoplay
  @Input() wrap = true;     // loop
  @Input() keyboard = true; // arrow keys
  @Input() pauseOnHover = true;
  @Input() pauseOnFocus = true;
  @Input() showNavigationArrows = true;
  @Input() showNavigationIndicators = true;
  @Input() animation = true; // enable/disable slide animation
  @Input() activeId?: string; // set to 'slide-0' etc. to control from outside

  get normalized() {
    return (this.images || []).map((s: NgbSlideLike) => (typeof s === 'string' ? { src: s } : s));
  }

  onSlide(event: any) {
    // event has .prev, .current, .direction
    // You can hook analytics or sync state here if desired.
  }
}
