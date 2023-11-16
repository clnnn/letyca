import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartResponse } from '@letyca/contracts';
import { LoadingState } from '../../utils';
import { TuiIslandModule } from '@taiga-ui/kit';
import { tuiIsString } from '@taiga-ui/cdk';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CountLabelComponent } from '../count-label/count-label.component';
import { PieComponent } from '../pie/pie.component';
import { LineComponent } from '../line/line.component';
import { TuiPoint } from '@taiga-ui/core';

@Component({
  selector: 'le-chart-preview',
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    LoadingSpinnerComponent,
    CountLabelComponent,
    PieComponent,
    LineComponent
],
  templateUrl: './chart-preview.component.html',
  styleUrls: ['./chart-preview.component.scss'],
})
export class ChartPreviewComponent {
  @Input()
  chart?: ChartResponse;

  @Input({ required: true })
  loading!: LoadingState;

  get title() {
    return this.chart?.title ?? '';
  }

  get countLabelValue() {
    if (this.chart?.chartType !== 'countLabel') {
      return 0;
    }
    const value = this.chart.data;
    return tuiIsString(value) ? Number.parseInt(value) : value ?? 0;
  }

  get pieChartLabels() {
    if (this.chart?.chartType !== 'pie') {
      return [];
    }

    return this.chart.data?.labels ?? [];
  }

  get pieChartValues() {
    if (this.chart?.chartType !== 'pie') {
      return [];
    }

    return this.chart.data?.values ?? [];
  }

  get lineChartPoints() {
    if (this.chart?.chartType !== 'line') {
      return [];
    }

    const points = this.chart.data?.points ?? [];
    return points.map<TuiPoint>((point) => [point.x ?? 0, point.y ?? 0]);
  }
}
