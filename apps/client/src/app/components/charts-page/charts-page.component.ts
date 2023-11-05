import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsPageHeaderComponent } from '../charts-page-header/charts-page-header.component';
import { ConnectionFacade } from '../../facade/connection.facade';
import { ConnectionListItem } from '@letyca/contracts';

@Component({
  selector: 'le-charts-page',
  standalone: true,
  imports: [CommonModule, ChartsPageHeaderComponent],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss'],
})
export class ChartsPageComponent implements OnInit {
  private readonly facade = inject(ConnectionFacade);

  readonly pageTitle = 'Charts';
  readonly connections = this.facade.connections;

  selectedConnection?: ConnectionListItem;

  ngOnInit(): void {
    this.facade.refresh();
  }

  connectionChange(item?: ConnectionListItem): void {
    this.selectedConnection = item;
  }
}
