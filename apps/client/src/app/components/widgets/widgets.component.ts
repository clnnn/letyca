import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '../../state';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiTitle, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';

const tuiImports = [TuiCell, TuiTitle, TuiButton, TuiIcon, TuiTable, TuiChip];

@Component({
  selector: 'le-widgets',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './widgets.component.html',
  styleUrl: './widgets.component.scss',
  imports: [...tuiImports],
})
export class WidgetsComponent {
  protected readonly store = inject(Store);
  protected readonly size: 'l' | 'm' | 's' = 'l';
}
