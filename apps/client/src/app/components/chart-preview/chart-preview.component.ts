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
import { ChartData } from 'chart.js';
import { BarComponent } from '../bar/bar.component';

@Component({
  selector: 'le-chart-preview',
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    LoadingSpinnerComponent,
    CountLabelComponent,
    PieComponent,
    LineComponent,
    BarComponent,
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
    const value = this.chart.countLabelData;
    return tuiIsString(value) ? Number.parseInt(value) : value ?? 0;
  }

  get pieChartData(): ChartData<'pie', number[], string | string> {
    if (this.chart?.chartType !== 'pie') {
      return { datasets: [] };
    }

    return {
      labels: this.chart.pieChartData?.labels ?? [],
      datasets: [
        {
          data: this.chart.pieChartData?.values ?? [],
        },
      ],
    };
  }

  get lineChartData(): ChartData<'line', number[], string | number> {
    if (this.chart?.chartType !== 'line') {
      return {
        datasets: [],
      };
    }

    return {
      labels: this.chart.lineChartData?.points.map((p) => p.x) ?? [],
      datasets: [
        {
          label: this.chart.lineChartData?.label ?? this.chart.title,
          data: this.chart.lineChartData?.points.map((p) => p.y) ?? [],
        },
      ],
    };
  }

  get barChartData(): ChartData<'bar', number[], string> {
    if (this.chart?.chartType !== 'bar') {
      return {
        datasets: [],
      };
    }

    return {
      labels: this.chart.barChartData?.labels ?? [],
      datasets: [
        {
          label: this.chart.barChartData?.label ?? this.chart.title,
          data: this.chart.barChartData?.data ?? [],
        },
      ],
    };
  }
}
