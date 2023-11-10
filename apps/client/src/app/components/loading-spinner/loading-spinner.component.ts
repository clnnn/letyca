import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'le-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
