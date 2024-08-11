import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { TitleComponent } from '../title/title.component';

@Component({
  selector: 'le-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  standalone: true,
  imports: [RouterOutlet, TuiIcon, TitleComponent],
})
export class PageComponent {}
