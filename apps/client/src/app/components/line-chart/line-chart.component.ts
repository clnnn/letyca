import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
} from '@angular/core';
import { LineChart } from '@letyca/contracts';
import { TuiTitle } from '@taiga-ui/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { AsyncPipe } from '@angular/common';
import { TypeWritterSerivce } from '../../service/typewriter.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'le-line-chart',
  standalone: true,
  imports: [TuiTitle, BaseChartDirective, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tui-text_h6">{{ title$ | async }}</span>
    <div class="container">
      <canvas
        class="line-chart"
        baseChart
        type="line"
        [data]="chart().data"
        [options]="options"
      ></canvas>
    </div>
  `,
  styles: `
  :host {
    display: flex;
    flex-direction: column;

    .container {
      width: 800px;
      height: 500px;
    }
  }`,
})
export class LineChartComponent {
  private readonly typeWritter = inject(TypeWritterSerivce);

  readonly chart = input.required<LineChart>();
  readonly title$ = toObservable(this.chart).pipe(
    map((chart) => chart.title.trim()),
    switchMap((text) => this.typeWritter.type({ text, speed: 40 })),
  );

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
