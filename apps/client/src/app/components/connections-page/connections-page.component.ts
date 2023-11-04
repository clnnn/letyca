import { Component, Injector, OnInit, inject, DestroyRef } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreateEditConnectionDialogContentComponent } from '../create-edit-connection-dialog-content/create-edit-connection-dialog-content.component';
import { ConnectionFacade } from '../../facade/connection.facade';
import { NewConnection } from '@letyca/contracts';
import { ConnectionsGridComponent } from '../connections-grid/connections-grid.component';
import { ConnectionsPageHeaderComponent } from '../connections-page-header/connections-page-header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'le-connections-page',
  templateUrl: './connections-page.component.html',
  styleUrls: ['./connections-page.component.scss'],
  standalone: true,
  imports: [ConnectionsPageHeaderComponent, ConnectionsGridComponent],
})
export class ConnectionsPageComponent implements OnInit {
  private readonly facade = inject(ConnectionFacade);
  private readonly dialogService = inject(TuiDialogService);
  private readonly injector = inject(Injector);
  private readonly destroy = inject(DestroyRef);

  readonly pageTitle = 'Connections';
  readonly connections = this.facade.connections;
  readonly loading = this.facade.loading;

  ngOnInit(): void {
    this.facade.refresh();
  }

  showNewConnectionDialog(): void {
    this.dialogService
      .open<NewConnection>(
        new PolymorpheusComponent(
          CreateEditConnectionDialogContentComponent,
          this.injector
        ),
        {
          label: 'New Connection',
          dismissible: true,
        }
      )
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((data) => {
        this.facade.add(data);
      });
  }
}
