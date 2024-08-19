import { Component, inject, OnDestroy } from '@angular/core';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { TypeWritterSerivce } from '../../service/typewriter.service';
import { AsyncPipe } from '@angular/common';
import { Store } from '../../state';
import { ChartGenerationLoadingComponent } from '../chart-generation-loading/chart-generation-loading.component';
import { ChartGenerationErrorComponent } from '../chart-generation-error/chart-generation-error.component';
import { ChartComponent } from '../chart/chart.component';
import { ExplorePromptComponent } from '../explore-prompt/explore-prompt.component';

const tuiImports = [TuiBlockStatus];

@Component({
  selector: 'le-chart-preview',
  standalone: true,
  imports: [
    ...tuiImports,
    AsyncPipe,
    ChartGenerationLoadingComponent,
    ChartGenerationErrorComponent,
    ChartComponent,
    ExplorePromptComponent,
  ],
  templateUrl: './chart-preview.component.html',
  styleUrls: ['./chart-preview.component.scss'],
})
export class ChartPreviewComponent {
  private readonly typeWritter = inject(TypeWritterSerivce);
  protected readonly store = inject(Store);
}
