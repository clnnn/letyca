import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../../directive/count-up.directive';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'le-count-label',
  standalone: true,
  imports: [CommonModule, CountUpDirective, TuiIslandModule],
  templateUrl: './count-label.component.html',
  styleUrls: ['./count-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountLabelComponent {
  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  value!: number;
}
