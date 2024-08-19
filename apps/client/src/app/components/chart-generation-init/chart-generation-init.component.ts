import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { TuiBlockStatus } from '@taiga-ui/layout';

const tuiImports = [TuiBlockStatus];

@Component({
  selector: 'le-chart-generation-init',
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
      <h2>No Chart Loaded</h2>
      Please describe your chart requirements
    </tui-block-status>
  `,
})
export class ChartGenerationInitComponent {
  protected readonly options: AnimationOptions = {
    loop: true,
    autoplay: true,
    path: '/assets/animations/chart-init.lottie.json',
  };
}
