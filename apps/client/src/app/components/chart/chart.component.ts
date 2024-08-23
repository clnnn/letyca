import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { CountUpDirective } from '../../directive/count-up.directive';
import { CountLabelComponent } from '../count-label/count-label.component';
import { Store } from '../../state';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { TuiButtonLoading, TuiChip, TuiTabs } from '@taiga-ui/kit';
import '@alenaksu/json-viewer';
import { HighlightJsDirective } from 'ngx-highlight-js';
import { format } from 'sql-formatter';

const tuiImports = [
  TuiCardLarge,
  TuiTitle,
  TuiTabs,
  TuiChip,
  TuiButtonLoading,
  TuiButton,
];

@Component({
  selector: 'le-chart',
  standalone: true,
  imports: [
    ...tuiImports,
    CountUpDirective,
    CountLabelComponent,
    PieChartComponent,
    BarChartComponent,
    LineChartComponent,
    HighlightJsDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  readonly store = inject(Store);
  readonly chart = this.store.previewChart()?.chart;

  get sql(): string {
    const sql = this.store.previewChart()?.sql ?? '';
    return format(sql, { language: 'postgresql' });
  }

  protected activeItemIndex = 0;
}
