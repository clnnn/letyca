import { Component, inject } from '@angular/core';
import { Store } from '../../state';
import { ChartGenerationLoadingComponent } from '../chart-generation-loading/chart-generation-loading.component';
import { ChartGenerationErrorComponent } from '../chart-generation-error/chart-generation-error.component';
import { ChartComponent } from '../chart/chart.component';
import { ExplorePromptComponent } from '../explore-prompt/explore-prompt.component';
import { ChartGenerationInitComponent } from '../chart-generation-init/chart-generation-init.component';

@Component({
  selector: 'le-chart-preview',
  standalone: true,
  imports: [
    ChartGenerationInitComponent,
    ChartGenerationLoadingComponent,
    ChartGenerationErrorComponent,
    ChartComponent,
    ExplorePromptComponent,
  ],
  templateUrl: './chart-preview.component.html',
  styleUrls: ['./chart-preview.component.scss'],
})
export class ChartPreviewComponent {
  protected readonly store = inject(Store);
}
