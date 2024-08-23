import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateWidgetRequest, CreateWidgetResponse } from '@letyca/contracts';
import { Observable } from 'rxjs';

@Injectable()
export class WidgetService {
  private readonly apiUrl = '/api/widgets';
  private readonly http = inject(HttpClient);

  save(
    request: CreateWidgetRequest,
    connectionId: string,
  ): Observable<CreateWidgetResponse> {
    return this.http.post<CreateWidgetResponse>(this.apiUrl, request, {
      params: { connectionId },
    });
  }
}
