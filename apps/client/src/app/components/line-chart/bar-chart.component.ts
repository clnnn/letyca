import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BarChart, LineChart } from '@letyca/contracts';
import { TuiTitle } from '@taiga-ui/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'le-line-chart',
  standalone: true,
  imports: [TuiTitle, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tui-text_h6">{{ chart.title }}</span>
    <div class="container">
      <canvas
        class="line-chart"
        baseChart
        type="line"
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
export class LineChartComponent {
  @Input({ required: true })
  chart!: LineChart;

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
