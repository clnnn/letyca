import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsPageHeaderComponent } from '../charts-page-header/charts-page-header.component';
import { ConnectionFacade } from '../../facade/connection.facade';
import { ConnectionListItem } from '@letyca/contracts';
import { ChartPreviewComponent } from '../chart-preview/chart-preview.component';

@Component({
  selector: 'le-charts-page',
  standalone: true,
  imports: [CommonModule, ChartsPageHeaderComponent, ChartPreviewComponent],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss'],
})
export class ChartsPageComponent implements OnInit {
  private readonly connectionFacade = inject(ConnectionFacade);

  readonly pageTitle = 'Charts';
  readonly connections = this.connectionFacade.connections;

  selectedConnection?: ConnectionListItem;

  ngOnInit(): void {
    this.connectionFacade.refresh();
  }

  connectionChange(item?: ConnectionListItem): void {
    this.selectedConnection = item;
  }

  messageSubmit(message: string): void {
    console.log(message);
  }
}
