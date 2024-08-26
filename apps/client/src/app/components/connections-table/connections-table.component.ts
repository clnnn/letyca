import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  output,
} from '@angular/core';
import { TuiTitle, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiCell } from '@taiga-ui/layout';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiChip } from '@taiga-ui/kit';
import { Connection } from '../../state';

const tuiImports = [TuiCell, TuiTitle, TuiButton, TuiIcon, TuiTable, TuiChip];

@Component({
  selector: 'le-connections-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './connections-table.component.html',
  styleUrls: ['./connections-table.component.scss'],
  imports: [...tuiImports],
})
export class ConnectionsTableComponent {
  protected readonly size: 'l' | 'm' | 's' = 'l';

  @Input({ required: true })
  connections: Connection[] = [];

  @Output()
  readonly newConnection = new EventEmitter<void>();
}
