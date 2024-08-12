import { NgIf, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TuiTitle,
  TuiInitialsPipe,
  TuiButton,
  TuiIcon,
  TuiLink,
  TuiAutoColorPipe,
  TuiDropdown,
} from '@taiga-ui/core';
import {
  TuiCheckbox,
  TuiAvatar,
  TuiItemsWithMore,
  TuiChip,
  TuiProgressBar,
  TuiBadge,
  TuiStatus,
  TuiRadioList,
} from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { TuiTable } from '@taiga-ui/addon-table';
import { ConnectionListItem } from '@letyca/contracts';

type Connection = ConnectionListItem;

@Component({
  selector: 'le-connections-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './connections-table.component.html',
  styleUrls: ['./connections-table.component.scss'],
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    TuiCell,
    TuiCheckbox,
    TuiTitle,
    TuiAvatar,
    TuiInitialsPipe,
    TuiItemsWithMore,
    TuiChip,
    TuiProgressBar,
    TuiButton,
    TuiBadge,
    TuiIcon,
    TuiStatus,
    TuiLink,
    TuiAutoColorPipe,
    TuiDropdown,
    TuiRadioList,
    TuiTable,
  ],
})
export class ConnectionsTableComponent {
  protected readonly size: 'l' | 'm' | 's' = 'l';

  @Input({ required: true })
  connections: Connection[] = [];

  protected readonly data: Connection[] = [
    {
      id: '1',
      host: 'localhost',
      port: 8080,
      database: 'northwind',
      schema: 'northwind',
    },
  ];
}
