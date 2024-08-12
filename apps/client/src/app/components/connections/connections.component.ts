import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConnectionsTableComponent } from '../connections-table/connections-table.component';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'le-connections',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConnectionsTableComponent, TuiButton],
  template: `
    <le-connections-table [connections]="connections"></le-connections-table>
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
export class ConnectionsComponent {
  connections = [
    {
      id: '1',
      host: 'localhost',
      port: 8080,
      database: 'northwind',
      schema: 'northwind',
    },
    {
      id: '2',
      host: 'localhost',
      port: 8080,
      database: 'northwind',
      schema: 'northwind',
    },
  ];

  newConnection() {
    console.log('New connection');
  }
}
