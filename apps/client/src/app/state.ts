import {
  ConnectionListItem,
  GenerateChartRequest,
  GenerateChartResponse,
} from '@letyca/contracts';
import { LoadingState } from './utils';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, exhaustMap, pipe, tap } from 'rxjs';
import { inject } from '@angular/core';
import { ConnectionService } from './service/connection.service';
import { tapResponse } from '@ngrx/operators';
import { SuggestionsService } from './service/suggestions.service';
import { ChartService } from './service/chart.service';

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

  suggestions: string[];
  suggestionsLoading: LoadingState;

  previewChart: GeneratedPreviewChart | null;
  previewChartLoading: LoadingState;
};

const initialState: State = {
  connectionsLoading: LoadingState.INIT,
  connections: [],

  suggestions: [],
  suggestionsLoading: LoadingState.INIT,

  previewChart: null,
  previewChartLoading: LoadingState.INIT,
};

// Signal store
export const Store = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      connectionService = inject(ConnectionService),
      suggestionsService = inject(SuggestionsService),
      chartService = inject(ChartService),
    ) => ({
      loadConnections: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() =>
            patchState(store, { connectionsLoading: LoadingState.LOADING }),
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
          }),
        ),
      ),
      loadSuggestions: rxMethod<string>(
        pipe(
          distinctUntilChanged(),
          tap(() =>
            patchState(store, { suggestionsLoading: LoadingState.LOADING }),
          ),
          exhaustMap((connectionId: string) =>
            suggestionsService.fetchAll(connectionId),
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
          }),
        ),
      ),
      generateChart: rxMethod<GenerateChartRequest>(
        pipe(
          tap(() =>
            patchState(store, { previewChartLoading: LoadingState.LOADING }),
          ),
          exhaustMap((request) => chartService.generateChart(request)),
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
    }),
  ),
);
