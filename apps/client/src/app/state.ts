import { ConnectionListItem } from '@letyca/contracts';
import { LoadingState } from './utils';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { ConnectionService } from './service/connection.service';
import { tapResponse } from '@ngrx/operators';

type State = {
  connectionsLoading: LoadingState;
  connections: ConnectionListItem[];
};

const initialState: State = {
  connectionsLoading: LoadingState.INIT,
  connections: [],
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, connectionService = inject(ConnectionService)) => ({
    loadConnections: rxMethod<void>(
      pipe(
        distinctUntilChanged(),
        tap(() =>
          patchState(store, { connectionsLoading: LoadingState.LOADING })
        ),
        exhaustMap(() => connectionService.fetchAll()),
        tapResponse({
          next: (connections) =>
            patchState(store, {
              connectionsLoading: LoadingState.LOADED,
              connections,
            }),
          error: () =>
            patchState(store, { connectionsLoading: LoadingState.ERROR }),
        })
      )
    ),
  }))
);
