import { Inject, Injectable } from '@angular/core';
import { ConnectionService } from '../service/connection.service';
import { TuiAlertService } from '@taiga-ui/core';
import { ConnectionListItem, NewConnection } from '@letyca/contracts';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { HttpErrorResponse } from '@angular/common/http';
import { tap, exhaustMap } from 'rxjs';

export type ConnectionState = {
  loading: boolean;
  connections: ConnectionListItem[];
};

@Injectable()
export class ConnectionFacade extends ComponentStore<ConnectionState> {
  constructor(
    private service: ConnectionService,
    @Inject(TuiAlertService) private alertService: TuiAlertService
  ) {
    super({ loading: false, connections: [] });
  }
  readonly connections$ = this.select((state) => state.connections);
  readonly loading$ = this.select((state) => state.loading);
  readonly refresh = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true })),
      exhaustMap(() =>
        this.service.fetchAll().pipe(
          tapResponse(
            (connections) => this.patchState({ connections }),
            (error: HttpErrorResponse) => console.error(error),
            () => this.patchState({ loading: false })
          )
        )
      )
    )
  );
  readonly add = this.effect<NewConnection>((newConnection$) =>
    newConnection$.pipe(
      exhaustMap((newConnection) => this.service.create(newConnection)),
      tapResponse(
        () => {
          this.alertService
            .open('The connection was successfully added', {
              label: 'Connection Added',
              status: 'success',
              icon: 'tuiIconCheckCircleLarge',
            })
            .subscribe();
          this.refresh();
        },
        (error: HttpErrorResponse) => console.error(error)
      )
    )
  );
  readonly delete = this.effect<string>((connectionId$) =>
    connectionId$.pipe(
      exhaustMap((connectionId) => this.service.deleteById(connectionId)),
      tapResponse(
        () => {
          this.alertService
            .open('The connection was successfully deleted', {
              label: 'Connection Deleted',
              status: 'success',
              icon: 'tuiIconCheckCircleLarge',
            })
            .subscribe();
          this.refresh();
        },
        (error: HttpErrorResponse) => console.error(error)
      )
    )
  );
}
