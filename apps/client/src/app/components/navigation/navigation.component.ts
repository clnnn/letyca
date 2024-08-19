import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { TuiTabs } from '@taiga-ui/kit';
import { RouterLink, RouterLinkActive } from '@angular/router';

const tuiImports = [TuiNavigation, TuiIcon, TuiTabs, TuiButton];

@Component({
  selector: 'le-navigation',
  standalone: true,
  imports: [...tuiImports, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tui-tabs [(activeItemIndex)]="activeItemIndex">
      <button tuiTab routerLink="/" iconStart="@tui.home">Home</button>
      <button tuiTab routerLink="/explore" iconStart="chart-bar">
        Explore
      </button>
      <button tuiTab routerLink="/connections" iconStart="cable">
        Connections
      </button>

      <button
        tuiTab
        [disabled]="true"
        routerLink="/widgets"
        iconStart="chart-scatter"
      >
        Widgets
      </button>
    </tui-tabs>
  `,
})
export class NavigationComponent {
  protected activeItemIndex = 0;
}
