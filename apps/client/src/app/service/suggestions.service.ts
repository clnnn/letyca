import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable()
export class SuggestionsService {
  private http = inject(HttpClient);

  fetchAll(connectionId: string): Observable<string[]> {
    return of([
      'What is the total number of products?',
      'Give me all top 5 customers by revenue',
      'I want to display monthly sales of condiments from 1997',
      'In descending order give all products with a price greater than 100',
      'Show me the total sales by category',
      'Give me the total sales by year',
      'What is the total sales by month?',
    ]).pipe(delay(3000));
  }
}
