import { Component, inject } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core/components/svg';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TuiTabsModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiLinkModule } from '@taiga-ui/core';
import { FeatureFlagFacade } from '../../facade/feature-flag.facade';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'le-browse-page',
  templateUrl: './browse-page.component.html',
  styleUrls: ['./browse-page.component.scss'],
  standalone: true,
  imports: [
    TuiTabsModule,
    TuiLinkModule,
    RouterLink,
    RouterLinkActive,
    TuiSvgModule,
    TuiIslandModule,
    RouterOutlet,
    AsyncPipe,
  ],
})
export class BrowsePageComponent {
  facade = inject(FeatureFlagFacade);
  demoMode = this.facade.demoMode;
}
