import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { BarChart } from '@letyca/contracts';
import { TuiTitle } from '@taiga-ui/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TypeWritterSerivce } from '../../service/typewriter.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'le-bar-chart',
  standalone: true,
  imports: [TuiTitle, BaseChartDirective, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tui-text_h6">{{ title$ | async }}</span>
    <div class="container">
      <canvas
        class="bar-chart"
        baseChart
        type="bar"
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
export class BarChartComponent {
  private readonly typeWritter = inject(TypeWritterSerivce);
  readonly chart = input.required<BarChart>();

  protected readonly title$ = toObservable(this.chart).pipe(
    map((chart) => chart.title.trim()),
    switchMap((text) => this.typeWritter.type({ text, speed: 40 })),
  );

  protected readonly options: ChartOptions = {
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
    },
  };
}
