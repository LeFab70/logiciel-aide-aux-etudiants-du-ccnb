import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from './models';

const ACCESS_TOKEN_KEY = 'ccnb_access_token';
const REFRESH_TOKEN_KEY = 'ccnb_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    return this.currentUserSignal()?.roles.includes(role as never) ?? false;
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request).pipe(
      tap((res) => this.storeTokens(res)),
      switchMap(() => this.loadCurrentUser()),
    );
  }

  login(request: LoginRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((res) => this.storeTokens(res)),
      switchMap(() => this.loadCurrentUser()),
    );
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(tap((res) => this.storeTokens(res)));
  }

  loadCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/users/me`)
      .pipe(tap((user) => this.currentUserSignal.set(user)));
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.currentUserSignal.set(null);
  }

  private storeTokens(res: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
  }
}
