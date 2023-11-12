import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiPieChartModule } from '@taiga-ui/addon-charts';
import { TuiHintModule } from '@taiga-ui/core';

@Component({
  selector: 'le-pie',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, TuiPieChartModule, TuiHintModule],
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieComponent {
  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  labels!: string[];

  @Input({ required: true })
  values!: number[];
}
