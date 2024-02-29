import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsPageHeaderComponent } from '../charts-page-header/charts-page-header.component';
import { ConnectionFacade } from '../../facade/connection.facade';
import { ConnectionListItem } from '@letyca/contracts';
import { ChartPromptComponent } from '../chart-prompt/chart-prompt.component';
import { ChartFacade } from '../../facade/chart.facade';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { ChartResponseComponent } from '../chart-response/chart-response.component';
import { FeatureFlagFacade } from '../../facade/feature-flag.facade';

@Component({
  selector: 'le-charts-page',
  standalone: true,
  imports: [
    CommonModule,
    ChartsPageHeaderComponent,
    ChartPromptComponent,
    ChartResponseComponent,
    TuiBlockStatusModule,
  ],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss'],
})
export class ChartsPageComponent implements OnInit {
  private readonly connectionFacade = inject(ConnectionFacade);
  private readonly chartFacade = inject(ChartFacade);
  private readonly featureFlagFacade = inject(FeatureFlagFacade);

  readonly pageTitle = 'Charts';
  readonly connections = this.connectionFacade.connections;
  readonly connectionsLoading = this.connectionFacade.loading;
  readonly chart = this.chartFacade.chart;
  readonly chartLoading = this.chartFacade.loading;
  readonly demoMode = this.featureFlagFacade.demoMode;

  selectedConnection = signal<ConnectionListItem | null>(null);

  ngOnInit(): void {
    this.connectionFacade.refresh();
  }

  connectionChange(item?: ConnectionListItem): void {
    this.selectedConnection.set(item ?? null);
  }

  humanQuerySubmit(userRequest: string): void {
    const connectionId = this.selectedConnection()?.id;
    if (!connectionId) {
      return;
    }

    this.chartFacade.generate({
      connectionId,
      userRequest,
    });
  }
}
