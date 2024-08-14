import { Routes } from '@angular/router';
import {
  ConnectionsComponent,
  ExploreComponent,
  HomeComponent,
} from './components';
import { ChartPreviewComponent } from './components/chart-preview/chart-preview.component';

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
    children: [
      {
        path: '',
        component: ExploreComponent,
      },
      {
        path: 'charts',
        component: ChartPreviewComponent,
      },
    ],
  },
];
