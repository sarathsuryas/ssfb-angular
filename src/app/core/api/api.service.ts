import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api-base-url.token';

export interface ApiEnvelope<T> {
  data: T;
}

type QueryParams = HttpParams | Record<string, string | number | boolean>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http
      .get<ApiEnvelope<T>>(this.url(path), { params })
      .pipe(map((response) => response.data));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiEnvelope<T>>(this.url(path), body)
      .pipe(map((response) => response.data));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<ApiEnvelope<T>>(this.url(path), body)
      .pipe(map((response) => response.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiEnvelope<T>>(this.url(path))
      .pipe(map((response) => response.data));
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
}
