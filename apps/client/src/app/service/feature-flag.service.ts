import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeatureFlagResponse } from '@letyca/contracts';

@Injectable()
export class FeatureFlagService {
  private readonly apiUrl = '/api/feature-flags';

  constructor(private readonly http: HttpClient) {}

  getFlags(): Observable<FeatureFlagResponse> {
    return this.http.get<FeatureFlagResponse>(this.apiUrl);
  }
}
