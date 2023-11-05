import { Inject, Injectable } from '@angular/core';
import { ConnectionService } from '../service/connection.service';
import { TuiAlertOptions, TuiAlertService } from '@taiga-ui/core';
import { ConnectionListItem, NewConnection } from '@letyca/contracts';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { HttpErrorResponse } from '@angular/common/http';
import { tap, exhaustMap, switchMap } from 'rxjs';
import { LoadingState } from '../utils';

export type ConnectionState = {
  loading: LoadingState;
  connections: ConnectionListItem[];
};

@Injectable()
export class ConnectionFacade extends ComponentStore<ConnectionState> {
  readonly connections = this.selectSignal((state) => state.connections);
  readonly loading = this.selectSignal((state) => state.loading);

  constructor(
    private service: ConnectionService,
    @Inject(TuiAlertService) private alertService: TuiAlertService
  ) {
    super({ loading: LoadingState.INIT, connections: [] });
  }

  readonly refresh = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: LoadingState.LOADING })),
      exhaustMap(() =>
        this.service.fetchAll().pipe(
          tapResponse(
            (connections) => this.patchState({ connections }),
            () => this.patchState({ loading: LoadingState.ERROR }),
            () => this.patchState({ loading: LoadingState.LOADED })
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
          this.displayAlert({
            content: 'The connection was successfully added',
            options: {
              label: 'Connection Added',
              status: 'success',
              icon: 'tuiIconCheckCircleLarge',
            },
          });
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
          this.displayAlert({
            content: 'The connection was successfully deleted',
            options: {
              label: 'Connection Deleted',
              status: 'success',
              icon: 'tuiIconCheckCircleLarge',
            },
          });
          this.refresh();
        },
        (error: HttpErrorResponse) => console.error(error)
      )
    )
  );

  readonly displayAlert = this.effect<{
    content: string;
    options: Partial<TuiAlertOptions<void>>;
  }>((options$) =>
    options$.pipe(
      switchMap(({ content, options }) =>
        this.alertService.open(content, options)
      )
    )
  );
}
