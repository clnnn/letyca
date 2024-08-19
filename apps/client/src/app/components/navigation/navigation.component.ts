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
    <tui-tabs [underline]="false">
      <a tuiTab routerLink="/" routerLinkActive iconStart="@tui.home">Home</a>
      <a tuiTab routerLink="/connections" routerLinkActive iconStart="cable">
        Connections
      </a>
    </tui-tabs>
  `,
})
export class NavigationComponent {}
