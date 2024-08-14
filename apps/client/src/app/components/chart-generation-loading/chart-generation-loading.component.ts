import { Component } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { TuiBlockStatus } from '@taiga-ui/layout';

const tuiImports = [TuiBlockStatus];

@Component({
  selector: 'le-chart-generation-loading',
  standalone: true,
  imports: [...tuiImports, LottieComponent],
  template: `
    <tui-block-status>
      <ng-lottie
        width="500px"
        height="500px"
        tuiSlot="top"
        [options]="options"
      />
      <h4>Loading</h4>
      Generating your awesome chart...
    </tui-block-status>
  `,
})
export class ChartGenerationLoadingComponent {
  protected readonly options: AnimationOptions = {
    loop: true,
    autoplay: true,
    path: '/assets/animations/chart-loading.lottie.json',
  };
}
