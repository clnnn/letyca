import { ConnectionListItem } from '@letyca/contracts';
import { LoadingState } from './utils';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, exhaustMap, pipe, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { ConnectionService } from './service/connection.service';
import { tapResponse } from '@ngrx/operators';
import { SuggestionsService } from './service/suggestions.service';

type State = {
  connectionsLoading: LoadingState;
  connections: ConnectionListItem[];
  selectedConnectionId: string | null;

  suggestions: string[];
  suggestionsLoading: LoadingState;
};

const initialState: State = {
  connectionsLoading: LoadingState.INIT,
  connections: [],
  selectedConnectionId: null,

  suggestions: [],
  suggestionsLoading: LoadingState.INIT,
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ connections, selectedConnectionId }) => ({
    selectedConnection: computed(
      () =>
        connections().find((conn) => conn.id === selectedConnectionId()) ?? null
    ),
  })),
  withMethods(
    (
      store,
      connectionService = inject(ConnectionService),
      suggestionsService = inject(SuggestionsService)
    ) => ({
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
      selectConnection(selectedConnectionId: string): void {
        patchState(store, () => ({ selectedConnectionId }));
      },
      loadSuggestions: rxMethod<string>(
        pipe(
          distinctUntilChanged(),
          tap(() =>
            patchState(store, { suggestionsLoading: LoadingState.LOADING })
          ),
          exhaustMap((connectionId: string) =>
            suggestionsService.fetchAll(connectionId)
          ),
          tapResponse({
            next: (recommendations) =>
              patchState(store, {
                suggestionsLoading: LoadingState.LOADED,
                suggestions: recommendations,
              }),
            error: () =>
              patchState(store, {
                suggestionsLoading: LoadingState.ERROR,
              }),
          })
        )
      ),
    })
  )
);
