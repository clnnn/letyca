import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ConnectionsTableComponent } from './components/connections-table/connections-table.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'connections',
    component: ConnectionsTableComponent,
  },
];
