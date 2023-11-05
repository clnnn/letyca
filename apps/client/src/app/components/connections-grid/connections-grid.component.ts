import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { configuration } from './configuration';
import { ConnectionListItem } from '@letyca/contracts';
import { TuiLoaderModule } from '@taiga-ui/core/components/loader';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { AgGridModule } from 'ag-grid-angular';
import { NgIf, NgClass } from '@angular/common';
import { LoadingState } from '../../utils';

@Component({
  selector: 'le-connections-grid',
  templateUrl: './connections-grid.component.html',
  styleUrls: ['./connections-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AgGridModule, NgClass, TuiBlockStatusModule, TuiLoaderModule],
})
export class ConnectionsGridComponent {
  readonly config = configuration;

  @Input({ required: true })
  data!: ConnectionListItem[];

  @Input({ required: true })
  loading!: LoadingState;
}
