import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetSuggestionResponse } from '@letyca/contracts';
import { Observable } from 'rxjs';

@Injectable()
export class SuggestionsService {
  private http = inject(HttpClient);

  fetch(connectionId: string): Observable<GetSuggestionResponse> {
    return this.http.get<GetSuggestionResponse>(`/api/suggestions`, {
      params: {
        connectionId,
      },
    });
  }
}
