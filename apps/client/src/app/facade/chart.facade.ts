import { Injectable } from '@angular/core';
import { ChartResponse } from '@letyca/contracts';

type ChartState = {
  chart?: ChartResponse;
  loading: boolean;
};

@Injectable()
export class ChartFacade {}
