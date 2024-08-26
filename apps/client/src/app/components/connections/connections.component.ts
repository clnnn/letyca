import {
  ChangeDetectionStrategy,
  Component,
  inject,
  INJECTOR,
} from '@angular/core';
import { ConnectionsTableComponent } from '../connections-table/connections-table.component';
import { TuiButton, TuiDialogService } from '@taiga-ui/core';
import { NewConnection, Store } from '../../state';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { CreateEditConnectionDialogContentComponent } from '../create-edit-connection-dialog-content/create-edit-connection-dialog-content.component';
import { filter } from 'rxjs';

@Component({
  selector: 'le-connections',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConnectionsTableComponent, TuiButton],
  template: `
    <le-connections-table
      [connections]="store.connections()"
      (newConnection)="openDialog()"
    ></le-connections-table>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    `,
  ],
})
export class ConnectionsComponent {
  readonly store = inject(Store);
  readonly dialog = inject(TuiDialogService);
  readonly injector = inject(INJECTOR);

  openDialog(): void {
    this.dialog
      .open<NewConnection>(
        new PolymorpheusComponent(
          CreateEditConnectionDialogContentComponent,
          this.injector,
        ),
        {
          label: 'Create new connection',
          dismissible: true,
        },
      )
      .pipe(
        filter(
          (data: NewConnection | null): data is NewConnection => data !== null,
        ),
      )
      .subscribe((data) => {
        this.store.createConnection(data);
      });
  }
}
