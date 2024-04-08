import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { TuiIslandModule } from '@taiga-ui/kit';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';

@Component({
  selector: 'le-bar',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent {
  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  data!: ChartData<'bar', number[], string>;

  protected readonly chartType: ChartType = 'bar';
  protected readonly options: ChartOptions = {
    plugins: {
      legend: {
        display: true,
      },
    },
  };
}
