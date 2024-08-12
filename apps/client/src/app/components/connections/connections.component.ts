import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ConnectionsTableComponent } from '../connections-table/connections-table.component';
import { TuiButton } from '@taiga-ui/core';
import { Store } from '../../state';

@Component({
  selector: 'le-connections',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConnectionsTableComponent, TuiButton],
  template: `
    <le-connections-table
      [connections]="store.connections()"
    ></le-connections-table>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
      }
    `,
  ],
})
export class ConnectionsComponent implements OnInit {
  readonly store = inject(Store);

  ngOnInit(): void {
    this.store.loadConnections();
  }

  newConnection() {
    console.log('New connection');
  }
}
