import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiHintModule, TuiPoint } from '@taiga-ui/core';
import { TuiAxesModule, TuiLineChartModule } from '@taiga-ui/addon-charts';
import { TUI_DEFAULT_STRINGIFY, TuiContextWithImplicit } from '@taiga-ui/cdk';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'le-line',
  standalone: true,
  imports: [
    CommonModule,
    TuiAxesModule,
    TuiLineChartModule,
    TuiHintModule,
    TuiIslandModule,
  ],
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineComponent implements OnChanges {
  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  points!: TuiPoint[];

  readonly stringify = TUI_DEFAULT_STRINGIFY;
  readonly hintContent = ({
    $implicit,
  }: TuiContextWithImplicit<readonly TuiPoint[]>): number => $implicit[0][1];

  height = 0;
  width = 0;

  ngOnChanges(): void {
    [this.width, this.height] = this.points.reduce(
      (acc, curr) => {
        const maxX = Math.max(acc[0], curr[0]);
        const maxY = Math.max(acc[1], acc[1]);
        return [maxX, maxY];
      },
      [this.width, this.height]
    );
    this.width = this.width + 20;
    this.height = this.height + 20;
  }
}
