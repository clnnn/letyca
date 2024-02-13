import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { FeatureFlagService } from '../service/feature-flag.service';
import { LoadingState } from '../utils';
import { exhaustMap, filter, tap } from 'rxjs';
import { FeatureFlagResponse } from '@letyca/contracts';

type FeatureFlagState = {
  loading: LoadingState;
  flags: FeatureFlagResponse;
};

@Injectable()
export class FeatureFlagFacade extends ComponentStore<FeatureFlagState> {
  readonly demoMode = this.selectSignal((state) => state.flags.demoMode);
  readonly demoMode$ = this.select((state) => state.flags.demoMode);
  readonly flagsLoaded = this.select((state) => state.loading).pipe(
    filter((loading) => loading === LoadingState.LOADED)
  );

  constructor(private service: FeatureFlagService) {
    super({ loading: LoadingState.INIT, flags: { demoMode: false } });
  }

  readonly load = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => this.patchState({ loading: LoadingState.LOADING })),
      exhaustMap(() => {
        return this.service.getFlags().pipe(
          tapResponse({
            next: (flags) => this.patchState({ flags }),
            error: () => this.patchState({ loading: LoadingState.ERROR }),
            complete: () => this.patchState({ loading: LoadingState.LOADED }),
          })
        );
      })
    );
  });
}
