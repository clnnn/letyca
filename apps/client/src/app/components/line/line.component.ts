import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { ChartData, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'le-line',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, TuiIslandModule],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineComponent {
  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  data!: ChartData<'line', number[], string | number>;

  protected readonly chartType: ChartType = 'line';
  protected readonly options: ChartOptions = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },
  };
}
