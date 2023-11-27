import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChartRequest, ChartResponse } from '@letyca/contracts';
import { Observable } from 'rxjs';

@Injectable()
export class ChartService {
  constructor(private http: HttpClient) {}

  generateChart(request: ChartRequest): Observable<ChartResponse> {
    return this.http.post<ChartResponse>('api/charts', request);
  }
}
