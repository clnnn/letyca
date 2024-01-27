import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartFacade } from '../../facade/chart.facade';
import '@alenaksu/json-viewer';

@Component({
  selector: 'le-chart-raw-data',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './chart-raw-data.component.html',
  styleUrls: ['./chart-raw-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartRawDataComponent {
  chart = this.facade.chart;

  constructor(private facade: ChartFacade) {}
}
