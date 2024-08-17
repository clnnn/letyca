import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { TuiBlockStatus, TuiCardLarge } from '@taiga-ui/layout';
import { CountUpDirective } from '../../directive/count-up.directive';
import { CountLabel } from '@letyca/contracts';

@Component({
  selector: 'le-count-label',
  standalone: true,
  imports: [TuiCardLarge, TuiTitle, CountUpDirective, TuiBlockStatus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div tuiCardLarge tuiSurface="elevated">
      <header tuiHeader>
        <h2 tuiTitle>{{ chart.title }}</h2>
      </header>

      @for (count of chart.data; track $index) {
        <section class="tui-text_h1" [leCountUp]="count"></section>
      }
    </div>
  `,
  styles: `
  :host {
    div {
        border: 1px solid black;
    }
  }
  `,
})
export class CountLabelComponent {
  @Input({ required: true })
  chart!: CountLabel;
}
