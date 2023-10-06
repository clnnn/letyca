import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { configuration } from './configuration';
import { ConnectionListItem } from '@letyca/contracts';

@Component({
  selector: 'le-connections-grid',
  templateUrl: './connections-grid.component.html',
  styleUrls: ['./connections-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionsGridComponent {
  readonly config = configuration;

  @Input()
  data!: ConnectionListItem[];

  @Input()
  isLoading?: boolean;
}
