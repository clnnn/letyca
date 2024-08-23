import { Routes } from '@angular/router';
import {
  ConnectionsComponent,
  ExploreComponent,
  HomeComponent,
} from './components';
import { WidgetsComponent } from './components/widgets/widgets.component';

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
    path: 'widgets',
    component: WidgetsComponent,
  },
  {
    path: 'explore',
    component: ExploreComponent,
  },
];
