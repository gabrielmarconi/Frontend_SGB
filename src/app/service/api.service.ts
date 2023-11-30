import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public get(endpoint: string, query?: string) {
    return this.http.get(`${environment.apiUrl}${endpoint}?${query ?? ''}`);
  }

  public getId(endpoint: string, id: string) {
    return this.http.get(`${environment.apiUrl}${endpoint}/${id ?? ''}`);
  }

  public post(endpoint: string, data?: any) {
    return this.http.post(`${environment.apiUrl}${endpoint}`, data);
  }

  public put(endpoint: string, data: any, id?: any) {
    return this.http.put(`${environment.apiUrl}${endpoint}/${id ?? ''}`, data);
  }

  public delete(endpoint: string, id: any) {
    return this.http.delete(`${environment.apiUrl}${endpoint}/${id}`);
  }
}
