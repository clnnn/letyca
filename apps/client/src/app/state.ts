import {
  ConnectionListItem,
  GenerateChartRequest,
  GenerateChartResponse,
} from '@letyca/contracts';
import { LoadingState } from './utils';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, exhaustMap, filter, map, pipe, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { ConnectionService } from './service/connection.service';
import { tapResponse } from '@ngrx/operators';
import { ChartService } from './service/chart.service';
import { SuggestionsService } from './service/suggestions.service';
import { WidgetService } from './service/widget.service';

// State models
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  avatarSrc?: string;
};

export type Connection = ConnectionListItem;

export type GeneratedPreviewChart = GenerateChartResponse;

type State = {
  connectionsLoading: LoadingState;
  connections: Connection[];

  selectedConnectionId: string | null;
  userRequest: string;

  previewChart: GeneratedPreviewChart | null;
  previewChartLoading: LoadingState;
  savingWidget: LoadingState;

  suggestionsLoading: LoadingState;
};

const initialState: State = {
  connectionsLoading: LoadingState.INIT,
  connections: [],

  selectedConnectionId: null,
  userRequest: '',

  previewChart: null,
  previewChartLoading: LoadingState.INIT,
  savingWidget: LoadingState.INIT,

  suggestionsLoading: LoadingState.INIT,
};

// Signal store
export const Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ selectedConnectionId, connections }) => ({
    selectedConnection: computed(() => {
      return connections().find((c) => c.id === selectedConnectionId()) ?? null;
    }),
  })),
  withMethods(
    (
      store,
      connectionService = inject(ConnectionService),
      chartService = inject(ChartService),
      suggestionsService = inject(SuggestionsService),
      widgetService = inject(WidgetService),
    ) => ({
      loadConnections: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() =>
            patchState(store, { connectionsLoading: LoadingState.LOADING }),
          ),
          exhaustMap(() =>
            connectionService.fetchAll().pipe(
              tapResponse({
                next: (connections) =>
                  patchState(store, {
                    connectionsLoading: LoadingState.LOADED,
                    connections,
                  }),
                error: () =>
                  patchState(store, { connectionsLoading: LoadingState.ERROR }),
              }),
            ),
          ),
        ),
      ),
      selectConnection(connectionId: string): void {
        patchState(store, { selectedConnectionId: connectionId });
      },
      setUserRequest(userRequest: string): void {
        patchState(store, { userRequest });
      },
      generateChart: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, { previewChartLoading: LoadingState.LOADING }),
          ),
          map(() => {
            const connectionId = store.selectedConnectionId();
            const userRequest = store.userRequest();

            if (!connectionId || !userRequest) {
              return null;
            }
            const req: GenerateChartRequest = { connectionId, userRequest };
            return req;
          }),
          filter((req): req is GenerateChartRequest => req !== null),
          exhaustMap((req) =>
            chartService.generateChart(req).pipe(
              tapResponse({
                next: (previewChart) =>
                  patchState(store, {
                    previewChartLoading: LoadingState.LOADED,
                    previewChart,
                  }),
                error: () =>
                  patchState(store, {
                    previewChartLoading: LoadingState.ERROR,
                  }),
              }),
            ),
          ),
        ),
      ),
      saveWidget: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { savingWidget: LoadingState.LOADING })),
          map(() => store.previewChart()),
          filter(
            (previewChart): previewChart is GeneratedPreviewChart =>
              previewChart !== null,
          ),
          exhaustMap((widget) =>
            widgetService.save(widget).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { savingWidget: LoadingState.LOADED });
                },
                error: () => {
                  patchState(store, { savingWidget: LoadingState.ERROR });
                },
              }),
            ),
          ),
        ),
      ),
      explorePageClosed(): void {
        patchState(store, {
          previewChart: null,
          previewChartLoading: LoadingState.INIT,
          userRequest: '',
          selectedConnectionId: null,
        });
      },
      loadSuggestion: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, {
              suggestionsLoading: LoadingState.LOADING,
              userRequest: 'Loading suggestion...',
            }),
          ),
          map(() => store.selectedConnectionId()),
          filter(
            (connectionId): connectionId is string => connectionId !== null,
          ),
          exhaustMap((connectionId) =>
            suggestionsService.fetch(connectionId).pipe(
              tapResponse({
                next: (res) =>
                  patchState(store, {
                    suggestionsLoading: LoadingState.LOADED,
                    userRequest: res.suggestion,
                  }),
                error: () =>
                  patchState(store, {
                    suggestionsLoading: LoadingState.ERROR,
                  }),
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(store) {
      store.loadConnections();
    },
  }),
);
