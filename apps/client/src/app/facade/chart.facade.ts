import { Injectable } from '@angular/core';
import {
  ChartData,
  ChartMetadata,
  GenerateChartRequest,
} from '@letyca/contracts';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ChartService } from '../service/chart.service';
import { LoadingState } from '../utils';
import { exhaustMap, tap } from 'rxjs';

type ChartState = {
  loading: LoadingState;
  chart?: ChartMetadata & ChartData;
  sql?: string;
};

@Injectable()
export class ChartFacade extends ComponentStore<ChartState> {
  readonly chart = this.selectSignal((state) => state.chart);
  readonly sql = this.selectSignal((state) => state.sql);
  readonly loading = this.selectSignal((state) => state.loading);

  constructor(private service: ChartService) {
    super({ loading: LoadingState.INIT });
  }

  readonly generate = this.effect<GenerateChartRequest>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: LoadingState.LOADING })),
      exhaustMap((request) =>
        this.service.generateChart(request).pipe(
          tapResponse({
            next: ({ chart, sql }) => this.patchState({ chart, sql }),
            error: () => this.patchState({ loading: LoadingState.ERROR }),
            complete: () => this.patchState({ loading: LoadingState.LOADED }),
          })
        )
      )
    )
  );
}
