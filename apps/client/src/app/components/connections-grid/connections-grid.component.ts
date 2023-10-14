import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { configuration } from './configuration';
import { ConnectionListItem } from '@letyca/contracts';
import { TuiLoaderModule } from '@taiga-ui/core/components/loader';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { AgGridModule } from 'ag-grid-angular';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'le-connections-grid',
    templateUrl: './connections-grid.component.html',
    styleUrls: ['./connections-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        AgGridModule,
        NgClass,
        TuiBlockStatusModule,
        TuiLoaderModule,
    ],
})
export class ConnectionsGridComponent {
  readonly config = configuration;

  @Input()
  data!: ConnectionListItem[];

  @Input()
  isLoading?: boolean;
}
