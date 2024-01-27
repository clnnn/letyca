import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiTabsModule } from '@taiga-ui/kit';
import { LoadingState } from '../../utils';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'le-chart-response',
  standalone: true,
  imports: [
    CommonModule,
    TuiTabsModule,
    LoadingSpinnerComponent,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './chart-response.component.html',
  styleUrls: ['./chart-response.component.scss'],
})
export class ChartResponseComponent {
  @Input({ required: true })
  loadingState!: LoadingState;
}
