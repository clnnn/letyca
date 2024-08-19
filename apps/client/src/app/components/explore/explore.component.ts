import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '../../state';
import { ExploreHeaderComponent } from '../explore-header/explore-header.component';
import { ExplorePromptComponent } from '../explore-prompt/explore-prompt.component';
import { ChartPreviewComponent } from '../chart-preview/chart-preview.component';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'le-explore',
  standalone: true,
  imports: [
    ExploreHeaderComponent,
    ExplorePromptComponent,
    ChartPreviewComponent,
    ChartComponent,
  ],
  template: `
    <div class="preview">
      <le-explore-header title="Explore" />
      <le-chart-preview />
    </div>
    <le-explore-prompt />
  `,
  styles: `
  :host {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .preview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
  }
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit, OnDestroy {
  readonly store = inject(Store);

  ngOnInit(): void {
    this.store.loadConnections();
  }

  ngOnDestroy(): void {
    this.store.explorePageClosed();
  }
}
