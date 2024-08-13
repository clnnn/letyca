import { Routes } from '@angular/router';
import {
  ConnectionsComponent,
  ExploreComponent,
  HomeComponent,
} from './components';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'connections',
    component: ConnectionsComponent,
  },
  {
    path: 'explore',
    component: ExploreComponent,
  },
];
