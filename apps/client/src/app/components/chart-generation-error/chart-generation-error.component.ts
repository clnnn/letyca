import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { TuiBlockStatus } from '@taiga-ui/layout';

const tuiImports = [TuiBlockStatus];

@Component({
  selector: 'le-chart-generation-error',
  standalone: true,
  imports: [...tuiImports, LottieComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tui-block-status>
      <ng-lottie
        width="500px"
        height="500px"
        tuiSlot="top"
        [options]="options"
      />
      <h2>Error</h2>
      Something went wrong while generating the chart.
    </tui-block-status>
  `,
})
export class ChartGenerationErrorComponent {
  protected readonly options: AnimationOptions = {
    loop: true,
    autoplay: true,
    path: '/assets/animations/chart-error.lottie.json',
  };
}
