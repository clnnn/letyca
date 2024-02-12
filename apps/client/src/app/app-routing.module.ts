import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { BrowsePageComponent } from './components/browse-page/browse-page.component';
import { ConnectionsPageComponent } from './components/connections-page/connections-page.component';
import { ChartsPageComponent } from './components/charts-page/charts-page.component';
import { ChartPreviewComponent } from './components/chart-preview/chart-preview.component';
import { ChartRawDataComponent } from './components/chart-raw-data/chart-raw-data.component';
import { ChartSqlViewerComponent } from './components/chart-sql-viewer/chart-sql-viewer.component';
import { FeatureFlagFacade } from './facade/feature-flag.facade';

const routes: Routes = [
  {
    path: 'browse',
    component: BrowsePageComponent,
    children: [
      {
        path: '',
        redirectTo: 'charts',
        pathMatch: 'full',
      },
      {
        path: 'connections',
        component: ConnectionsPageComponent,
        canActivate: [
          () => {
            const facade = inject(FeatureFlagFacade);
            const router = inject(Router);
            if (!facade.demoMode()) {
              return true;
            } else {
              router.navigate(['/browse']);
              return false;
            }
          },
        ],
      },
      {
        path: 'charts',
        component: ChartsPageComponent,
        children: [
          {
            path: '',
            redirectTo: 'preview',
            pathMatch: 'full',
          },
          {
            path: 'preview',
            component: ChartPreviewComponent,
          },
          {
            path: 'raw-data',
            component: ChartRawDataComponent,
          },
          {
            path: 'sql-query',
            component: ChartSqlViewerComponent,
          },
        ],
      },
    ],
  },
  {
    path: '',
    redirectTo: 'browse',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
