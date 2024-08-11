import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { User } from '../../models';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'le-avatar',
  standalone: true,
  imports: [TuiAvatar, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<tui-avatar
    [src]="
      currentUser.avatarSrc ? currentUser.avatarSrc : initials(currentUser)
    "
  ></tui-avatar>`,
})
export class AvatarComponent {
  @Input({ required: true })
  currentUser!: User;

  protected initials(user: User): string {
    if (!user.firstName || !user.lastName) {
      return '@tui.user'; // default avatar
    }

    return user.firstName[0] + user.lastName[0];
  }
}
