import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsPageHeaderComponent } from '../charts-page-header/charts-page-header.component';
import { ConnectionFacade } from '../../facade/connection.facade';

@Component({
  selector: 'le-charts-page',
  standalone: true,
  imports: [CommonModule, ChartsPageHeaderComponent],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss'],
})
export class ChartsPageComponent {
  private readonly facade = inject(ConnectionFacade);

  readonly pageTitle = 'Charts';
  readonly connections = this.facade.connections;
}
