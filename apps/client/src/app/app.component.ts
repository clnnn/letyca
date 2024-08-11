import { Component } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { PageComponent } from './components/page/page.component';

@Component({
  selector: 'le-root',
  standalone: true,
  imports: [TuiRoot, PageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
