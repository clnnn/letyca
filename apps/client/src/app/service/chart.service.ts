import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenerateChartRequest, GenerateChartResponse } from '@letyca/contracts';
import { Observable } from 'rxjs';

@Injectable()
export class ChartService {
  private readonly apiUrl = '/api/charts';
  constructor(private readonly http: HttpClient) {}

  generateChart(
    request: GenerateChartRequest
  ): Observable<GenerateChartResponse> {
    return this.http.post<GenerateChartResponse>(this.apiUrl, request);
  }
}
