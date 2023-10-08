import { Component, Inject, Injector, OnInit } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreateEditConnectionDialogContentComponent } from '../create-edit-connection-dialog-content/create-edit-connection-dialog-content.component';
import { ConnectionFacade } from '../../facade/connection.facade';
import { NewConnection } from '@letyca/contracts';

@Component({
  selector: 'le-connections-page',
  templateUrl: './connections-page.component.html',
  styleUrls: ['./connections-page.component.scss'],
})
export class ConnectionsPageComponent implements OnInit {
  readonly pageTitle = 'Connections';
  readonly connections = this.facade.connections;
  readonly loading = this.facade.loading;

  constructor(
    private facade: ConnectionFacade,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

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
      .subscribe((data) => {
        this.facade.add(data);
      });
  }
}
