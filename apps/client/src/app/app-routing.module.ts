import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { BrowsePageComponent } from './components/browse-page/browse-page.component';
import { ConnectionsPageComponent } from './components/connections-page/connections-page.component';

const routes: Routes = [
  {
    path: 'browse',
    component: BrowsePageComponent,
    children: [
      {
        path: '',
        redirectTo: 'connections',
        pathMatch: 'full',
      },
      {
        path: 'connections',
        component: ConnectionsPageComponent,
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
