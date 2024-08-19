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
    <le-explore-header class="header" title="Explore" />
    <le-chart-preview class="chart-preview" />
    <le-explore-prompt class="footer" />
  `,
  styles: `
  :host {
    display: grid;
    grid-template-areas:
      'header'
      'main'
      'footer';
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 1rem;
    overflow: hidden;

    .header {
      grid-area: header;
    }

    .chart-preview {
      grid-area: main;
      overflow: auto;
    }

    .footer {
      grid-area: footer;
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
