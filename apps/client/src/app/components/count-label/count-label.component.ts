import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
} from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { TuiBlockStatus, TuiCardLarge } from '@taiga-ui/layout';
import { CountUpDirective } from '../../directive/count-up.directive';
import { CountLabel } from '@letyca/contracts';
import { TypeWritterSerivce } from '../../service/typewriter.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'le-count-label',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiTitle,
    CountUpDirective,
    TuiBlockStatus,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div tuiCardLarge tuiSurface="elevated">
      <header tuiHeader>
        <h2 tuiTitle>{{ title$ | async }}</h2>
      </header>

      @for (count of chart().data; track $index) {
        <section class="tui-text_h1" [leCountUp]="count"></section>
      }
    </div>
  `,
})
export class CountLabelComponent {
  protected readonly typeWritter = inject(TypeWritterSerivce);

  readonly chart = input.required<CountLabel>();

  protected readonly title$ = toObservable(this.chart).pipe(
    map((chart) => chart.title.trim()),
    switchMap((text) => this.typeWritter.type({ text, speed: 40 })),
  );
}
