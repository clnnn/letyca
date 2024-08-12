import { Routes } from '@angular/router';
import { ConnectionsComponent, HomeComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'connections',
    component: ConnectionsComponent,
  },
];
