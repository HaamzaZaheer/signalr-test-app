import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://profile-moc-test.happyocean-70c0e1b4.uaenorth.azurecontainerapps.io/api/v1/auth';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, { headers: { 'auth': 'JwAAAB_@_LCAAAAAAAAArLrczNT9HNKLJKCs4wzctyL0r0KXIxjXJ0dDVwKy73CIjITQqNKMgEADZjkscnAAAA' } }).pipe(
      tap(response => {
        if (response.isSuccess && response.data.token) {
          this.tokenSubject.next(response.data.token);
          console.log('Login successful, token stored');
        }
      })
    );
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  clearToken(): void {
    this.tokenSubject.next(null);
  }
}
