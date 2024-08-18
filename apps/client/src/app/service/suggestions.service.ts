import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SuggestionsService {
  private http = inject(HttpClient);

  fetchAll(connectionId: string, userRequest?: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/suggestions`, {
      params: {
        connectionId,
      },
    });
  }
}
