import { Injectable } from '@angular/core';
import { ChartRequest, LetycaChart } from '@letyca/contracts';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ChartService } from '../service/chart.service';
import { LoadingState } from '../utils';
import { exhaustMap, tap } from 'rxjs';

type ChartState = {
  loading: LoadingState;
  chart?: LetycaChart;
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

  readonly generate = this.effect<ChartRequest>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: LoadingState.LOADING })),
      exhaustMap((request) =>
        this.service.generateChart(request).pipe(
          tapResponse(
            ({ chart, sql }) => this.patchState({ chart, sql }),
            () => this.patchState({ loading: LoadingState.ERROR }),
            () => this.patchState({ loading: LoadingState.LOADED })
          )
        )
      )
    )
  );
}
