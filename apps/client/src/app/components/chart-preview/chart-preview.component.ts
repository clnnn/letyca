import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';
import { tuiIsString } from '@taiga-ui/cdk';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CountLabelComponent } from '../count-label/count-label.component';
import { PieComponent } from '../pie/pie.component';
import { LineComponent } from '../line/line.component';
import { ChartData } from 'chart.js';
import { BarComponent } from '../bar/bar.component';
import { ChartFacade } from '../../facade/chart.facade';

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
  chart = this.facade.chart;

  constructor(private facade: ChartFacade) {}

  get title() {
    return this.chart()?.title ?? '';
  }

  get countLabelValue() {
    if (this.chart()?.chartType !== 'countLabel') {
      return 0;
    }
    const value = this.chart()?.countLabelData;
    return tuiIsString(value) ? Number.parseInt(value) : value ?? 0;
  }

  get pieChartData(): ChartData<'pie', number[], string | string> {
    if (this.chart()?.chartType !== 'pie') {
      return { datasets: [] };
    }

    return {
      labels: this.chart()?.pieData?.labels ?? [],
      datasets: [
        {
          data: this.chart()?.pieData?.values ?? [],
        },
      ],
    };
  }

  get lineChartData(): ChartData<'line', number[], string | number> {
    if (this.chart()?.chartType !== 'line') {
      return {
        datasets: [],
      };
    }

    return {
      labels: this.chart()?.lineData?.labels ?? [],
      datasets: [
        {
          label: this.chart()?.title ?? '',
          data: this.chart()?.lineData?.values ?? [],
        },
      ],
    };
  }

  get barChartData(): ChartData<'bar', number[], string> {
    if (this.chart()?.chartType !== 'bar') {
      return {
        datasets: [],
      };
    }

    return {
      labels: this.chart()?.barData?.labels ?? [],
      datasets: [
        {
          label: this.chart()?.title ?? '',
          data: this.chart()?.barData?.values ?? [],
        },
      ],
    };
  }
}
