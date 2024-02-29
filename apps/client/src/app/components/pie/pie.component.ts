import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'le-pie',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, NgChartsModule],
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieComponent {
  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  data!: ChartData<'pie', number[], string>;

  protected readonly chartType: ChartType = 'pie';
  protected readonly options: ChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
  };

  chartClick(): void {
    // No-op
  }
}
