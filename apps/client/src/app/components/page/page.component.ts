import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { TitleComponent } from '../title/title.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { User } from '../../models';
import { TuiButton } from '@taiga-ui/core';

const tuiImports = [TuiButton];

@Component({
  selector: 'le-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  standalone: true,
  imports: [
    ...tuiImports,
    RouterOutlet,
    TitleComponent,
    NavigationComponent,
    AvatarComponent,
    RouterLink,
    RouterLinkActive,
  ],
})
export class PageComponent {
  protected readonly appTitle = 'Letyca';
  protected readonly guestUser: User = {
    id: 'guest',
    firstName: 'John',
    lastName: 'Doe',
    avatarSrc: '',
  };
}
