import { Component } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { PageComponent } from './components/page/page.component';

@Component({
  selector: 'le-root',
  standalone: true,
  imports: [TuiRoot, PageComponent],
  template: `
    <tui-root>
      <le-page />
    </tui-root>
  `,
  styles: `
  :host {
    background-color: #f0f2f5;
  }
  `,
})
export class AppComponent {}
