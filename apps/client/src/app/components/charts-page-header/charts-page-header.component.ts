import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'le-charts-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts-page-header.component.html',
  styleUrls: ['./charts-page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsPageHeaderComponent {
  @Input({ required: true })
  title!: string;
}
