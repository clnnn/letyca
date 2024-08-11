import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { TuiTabs } from '@taiga-ui/kit';
import { RouterLink, RouterLinkActive } from '@angular/router';

const tuiImports = [TuiNavigation, TuiIcon, TuiTabs];

@Component({
  selector: 'le-navigation',
  standalone: true,
  imports: [...tuiImports, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tui-tabs>
      <a tuiTab iconStart="@tui.home" routerLink="/home" routerLinkActive
        >Home
      </a>
      <a tuiTab iconStart="cable" routerLink="/connections" routerLinkActive
        >Connections
      </a>
      <a tuiTab iconStart="chart-scatter" routerLink="/widgets" routerLinkActive
        >Widgets
      </a>
      <a
        tuiTab
        iconStart="layout-dashboard"
        routerLink="/dashboards"
        routerLinkActive
        >Dashboards
      </a>
    </tui-tabs>
  `,
})
export class NavigationComponent {
  // Component logic goes here
}
