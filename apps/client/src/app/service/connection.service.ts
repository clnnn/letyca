import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionListItem, NewConnection } from '@letyca/contracts';
import { Observable } from 'rxjs';

@Injectable()
export class ConnectionService {
  constructor(private http: HttpClient) {}

  create(connection: NewConnection): Observable<string> {
    return this.http.post<string>('api/connections', connection);
  }

  fetchAll(): Observable<ConnectionListItem[]> {
    return this.http.get<ConnectionListItem[]>('api/connections');
  }

  deleteById(connectionId: string): Observable<void> {
    return this.http.delete<void>(`api/connections/${connectionId}`);
  }
}
