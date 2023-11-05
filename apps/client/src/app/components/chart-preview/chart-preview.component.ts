import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartResponse } from '@letyca/contracts';
import { LoadingState } from '../../utils';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CountUpDirective } from '../../directive/count-up.directive';
import { tuiIsString } from '@taiga-ui/cdk';

@Component({
  selector: 'le-chart-preview',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, CountUpDirective],
  templateUrl: './chart-preview.component.html',
  styleUrls: ['./chart-preview.component.scss'],
})
export class ChartPreviewComponent {
  @Input()
  chart?: ChartResponse;

  @Input({ required: true })
  loading!: LoadingState;

  get countLabelValue() {
    const value = this.chart?.data?.rows?.[0]?.[0];
    return tuiIsString(value) ? Number.parseInt(value) : value ?? 0;
  }
}
