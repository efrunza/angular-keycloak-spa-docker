import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;
  getUsers() { return firstValueFrom(this.http.get<any>(`${this.base}/users`)); }
  getMe() { return firstValueFrom(this.http.get<any>(`${this.base}/me`)); }
}
