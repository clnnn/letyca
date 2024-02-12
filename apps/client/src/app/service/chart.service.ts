import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChartRequest, ChartResponse } from '@letyca/contracts';
import { Observable } from 'rxjs';

@Injectable()
export class ChartService {
  private readonly apiUrl = '/api/charts';
  constructor(private readonly http: HttpClient) {}

  generateChart(request: ChartRequest): Observable<ChartResponse> {
    return this.http.post<ChartResponse>(this.apiUrl, request);
  }
}
