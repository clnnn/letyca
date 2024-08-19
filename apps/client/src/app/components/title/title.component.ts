import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'le-title',
  standalone: true,
  template: `
    <tui-icon icon="chart-spline" />
    <span class="tui-text_h6">{{ content }}</span>
  `,
  styles: `
    :host {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }`,
  imports: [TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  @Input({ required: true, transform: trimTitle })
  content = '';
}

function trimTitle(content: string): string {
  return content.trim();
}
