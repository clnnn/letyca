import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { TypeWritterSerivce } from '../../service/typewriter.service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, exhaustMap, map, ReplaySubject } from 'rxjs';

const tuiImports = [TuiBlockStatus];

@Component({
  selector: 'le-chart-generation-loading',
  standalone: true,
  imports: [...tuiImports, LottieComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tui-block-status>
      <ng-lottie
        width="500px"
        height="500px"
        tuiSlot="top"
        [options]="options"
      />
      <h2>"{{ typeWrittenUserRequest$ | async }}"</h2>
      Be patient, the chart is being preparing for you.
    </tui-block-status>
  `,
})
export class ChartGenerationLoadingComponent {
  protected readonly typeWritter = inject(TypeWritterSerivce);
  private readonly userRequest$ = new BehaviorSubject<string>('');
  protected readonly typeWrittenUserRequest$ = this.userRequest$.pipe(
    map((text) => text.trim()),
    exhaustMap((text) => this.typeWritter.type({ text, speed: 30 })),
  );

  @Input({ required: true })
  set userRequest(value: string) {
    this.userRequest$.next(value);
  }

  protected readonly options: AnimationOptions = {
    loop: true,
    autoplay: true,
    path: '/assets/animations/chart-loading.lottie.json',
  };
}
