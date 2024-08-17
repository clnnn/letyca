import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PieChart } from '@letyca/contracts';
import { TuiTitle } from '@taiga-ui/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'le-pie-chart',
  standalone: true,
  imports: [TuiTitle, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tui-text_h6">{{ chart.title }}</span>
    <div class="container">
      <canvas
        class="pie-chart"
        baseChart
        type="pie"
        [data]="chart.data"
        [options]="options"
      ></canvas>
    </div>
  `,
  styles: `
  :host {
    display: flex;
    flex-direction: column;

    .container {
      width: 1000px;
      height: 600px;
    }
  }`,
})
export class PieChartComponent {
  @Input({ required: true })
  chart!: PieChart;

  protected readonly options: ChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
  };
}
