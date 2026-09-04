import { Component } from '@angular/core';

/**
 * Hosts the standalone EYNTKA series-map viewer (a self-contained Vite +
 * Cytoscape app) in an iframe. The built viewer is synced into
 * assets/series-map/ by `npm run sync:web` in the textbooks repo's
 * .eyntka/series-map/ project. Angular stays fully decoupled from the
 * viewer's dependencies, it only points an iframe at the static bundle.
 */
@Component({
    selector: 'app-series-map',
    templateUrl: './series-map.component.html',
    styleUrls: ['./series-map.component.scss'],
    standalone: false
})
export class SeriesMapComponent {
  // ?mode=site applies the embedded styling (stronger WIP treatment, etc.).
  // The ?v= token is a per-load cache-bust: the viewer's index.html is a fixed
  // URL that GitHub Pages caches, so without this a stale index.html keeps
  // pointing at an old (pre-fix) hashed bundle after a redeploy. The viewer
  // forwards this token onto its graph.json fetch too, so data can't be stale.
  readonly src = `assets/series-map/index.html?mode=site&v=${Date.now()}`;
}
