import {
  ConnectionListItem,
  CreateWidgetRequest,
  GenerateChartRequest,
  GenerateChartResponse,
  WidgetListItem,
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
import {
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  of,
  pipe,
  tap,
  withLatestFrom,
} from 'rxjs';
import { computed, effect, inject } from '@angular/core';
import { ConnectionService } from './service/connection.service';
import { tapResponse } from '@ngrx/operators';
import { ChartService } from './service/chart.service';
import { SuggestionsService } from './service/suggestions.service';
import { WidgetService } from './service/widget.service';
import { TuiAlertService } from '@taiga-ui/core';
import { toObservable } from '@angular/core/rxjs-interop';

// State models
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  avatarSrc?: string;
};

export type Connection = ConnectionListItem;

export type GeneratedPreviewChart = GenerateChartResponse;

export type Widget = WidgetListItem;

type State = {
  connectionsLoading: LoadingState;
  connections: Connection[];

  selectedConnectionId: string | null;
  userRequest: string;

  previewChart: GeneratedPreviewChart | null;
  previewChartLoading: LoadingState;

  suggestionsLoading: LoadingState;

  savingWidget: LoadingState;
  widgets: Widget[];
  widgetsLoading: LoadingState;
};

const initialState: State = {
  connectionsLoading: LoadingState.INIT,
  connections: [],

  selectedConnectionId: null,
  userRequest: '',

  previewChart: null,
  previewChartLoading: LoadingState.INIT,

  suggestionsLoading: LoadingState.INIT,

  savingWidget: LoadingState.INIT,
  widgets: [],
  widgetsLoading: LoadingState.INIT,
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ selectedConnectionId, connections, widgets }) => ({
    selectedConnection: computed(() => {
      return connections().find((c) => c.id === selectedConnectionId()) ?? null;
    }),
    widgetTableData: computed(() => {
      return widgets().map((w) => {
        const connection =
          connections().find((c) => c.id === w.connectionId) ?? null;
        return { ...w, connection };
      });
    }),
  })),
  withMethods(
    (
      store,
      connectionService = inject(ConnectionService),
      chartService = inject(ChartService),
      suggestionsService = inject(SuggestionsService),
      widgetService = inject(WidgetService),
      alerts = inject(TuiAlertService),
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
          map(
            () => [store.previewChart(), store.selectedConnectionId()] as const,
          ),
          exhaustMap(([previewChart, connectionId]) => {
            if (!previewChart || !connectionId) {
              return of(null);
            }
            const req: CreateWidgetRequest = {
              chartMetadata: {
                title: previewChart.chart.title,
                chartType: previewChart.chart.chartType,
              },
              query: previewChart.query,
            };
            return widgetService.save(req, connectionId).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { savingWidget: LoadingState.LOADED });
                  alerts
                    .open('Widget saved successfully', {
                      label: 'Success',
                      appearance: 'success',
                    })
                    .subscribe();
                },
                error: () => {
                  alerts
                    .open('Failed to save widget', {
                      label: 'Error',
                      appearance: 'error',
                    })
                    .subscribe();
                  patchState(store, { savingWidget: LoadingState.ERROR });
                },
              }),
            );
          }),
        ),
      ),
      loadWidgets: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, { widgetsLoading: LoadingState.LOADING }),
          ),
          exhaustMap(() =>
            widgetService.fetchAll().pipe(
              tapResponse({
                next: (res) =>
                  patchState(store, {
                    widgetsLoading: LoadingState.LOADED,
                    widgets: res.widgets,
                  }),
                error: () =>
                  patchState(store, { widgetsLoading: LoadingState.ERROR }),
              }),
            ),
          ),
        ),
      ),
      deleteWidget: rxMethod<string>(
        pipe(
          exhaustMap((widgetId) =>
            widgetService.delete(widgetId).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    widgets: store.widgets().filter((w) => w.id !== widgetId),
                  });
                  alerts
                    .open('Widget deleted successfully', {
                      label: 'Success',
                      appearance: 'success',
                    })
                    .subscribe();
                },
                error: () => {
                  alerts
                    .open('Failed to delete widget', {
                      label: 'Error',
                      appearance: 'error',
                    })
                    .subscribe();
                },
              }),
            ),
          ),
        ),
      ),
      copyToClipboard: rxMethod<string>(
        pipe(
          exhaustMap((widgetId) =>
            widgetService.fetchEmbedded(widgetId).pipe(
              tapResponse({
                next: async (res) => {
                  await navigator.clipboard.writeText(res);
                  alerts
                    .open('Widget URL copied to clipboard', {
                      label: 'Success',
                      appearance: 'success',
                    })
                    .subscribe();
                },
                error: (e) => {
                  console.error(e);
                  alerts
                    .open('Failed to copy widget URL', {
                      label: 'Error',
                      appearance: 'error',
                    })
                    .subscribe();
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
