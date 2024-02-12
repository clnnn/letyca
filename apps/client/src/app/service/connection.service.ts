import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionListItem, NewConnection } from '@letyca/contracts';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectionService {
  private readonly apiUrl = '/api/connections';

  constructor(private readonly http: HttpClient) {}

  create(connection: NewConnection): Observable<string> {
    return this.http.post<string>(this.apiUrl, connection);
  }

  fetchAll(): Observable<ConnectionListItem[]> {
    return this.http.get<ConnectionListItem[]>(this.apiUrl);
  }

  deleteById(connectionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${connectionId}`);
  }
}
