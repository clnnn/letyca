import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
} from '@angular/core';
import { PieChart } from '@letyca/contracts';
import { TuiTitle } from '@taiga-ui/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TypeWritterSerivce } from '../../service/typewriter.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'le-pie-chart',
  standalone: true,
  imports: [TuiTitle, BaseChartDirective, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tui-text_h6">{{ title$ | async }}</span>
    <div class="container">
      <canvas
        class="pie-chart"
        baseChart
        type="pie"
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
export class PieChartComponent {
  private readonly typeWritter = inject(TypeWritterSerivce);
  readonly chart = input.required<PieChart>();
  protected readonly title$ = toObservable(this.chart).pipe(
    map((chart) => chart.title.trim()),
    switchMap((text) => this.typeWritter.type({ text, speed: 40 })),
  );

  protected readonly options: ChartOptions = {
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
    },
  };
}
