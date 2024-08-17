import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiTitle } from '@taiga-ui/core';
import { CountUpDirective } from '../../directive/count-up.directive';
import { CountLabelComponent } from '../count-label/count-label.component';
import { Store } from '../../state';

const tuiImports = [TuiCardLarge, TuiTitle];

@Component({
  selector: 'le-chart',
  standalone: true,
  imports: [...tuiImports, CountUpDirective, CountLabelComponent],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  readonly store = inject(Store);
  readonly chart = this.store.previewChart()?.chart;
}
