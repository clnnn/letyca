import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TUI_ARROW } from '@taiga-ui/kit';

@Component({
  selector: 'le-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  readonly menuIcon = TUI_ARROW;

  search = new FormControl('');
}
