import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  unreadNotifCount: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  register(userData: { email: string; password: string; first_name: string; last_name: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('access_token');
    }
  }

  isAuthenticated(): boolean {
    if (this.isLocalStorageAvailable()) {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.setAccessToken(response);
    this.currentUserSubject.next(response.user);
  }

  setAccessToken(response: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('access_token', response.access_token);
    }
  }
}