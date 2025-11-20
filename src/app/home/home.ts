import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SignalrService } from '../services/signalr.service';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  // Login form
  loginRequest: LoginRequest = {
    email: 'abdullah.qahtani@example.com',
    password: 'password123'
  };
  
  // State managed with BehaviorSubjects
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  private isLoggingInSubject = new BehaviorSubject<boolean>(false);
  isLoggingIn$ = this.isLoggingInSubject.asObservable();
  
  private loginErrorSubject = new BehaviorSubject<string | null>(null);
  loginError$ = this.loginErrorSubject.asObservable();
  
  private currentTokenSubject = new BehaviorSubject<string | null>(null);
  currentToken$ = this.currentTokenSubject.asObservable();
  
  // SignalR state observables - will be assigned in constructor
  connectionStatus$!: typeof this.signalrService.connectionStatus$;
  messages$!: typeof this.signalrService.messages$;
  
  constructor(
    public authService: AuthService,
    public signalrService: SignalrService
  ) {
    // Initialize SignalR observables
    this.connectionStatus$ = this.signalrService.connectionStatus$;
    this.messages$ = this.signalrService.messages$;
  }

  ngOnInit(): void {
    // Subscribe to token changes
    this.authService.token$.subscribe(token => {
      this.currentTokenSubject.next(token);
      this.isLoggedInSubject.next(!!token);
      console.log('Token updated, isLoggedIn:', !!token);
    });
  }

  ngOnDestroy(): void {
    this.signalrService.stopConnection();
  }

  onLogin(): void {
    this.isLoggingInSubject.next(true);
    this.loginErrorSubject.next(null);
    
    this.authService.login(this.loginRequest).subscribe({
      next: (response: LoginResponse) => {
        this.isLoggingInSubject.next(false);
        if (response.isSuccess) {
          console.log('Login successful:', response);
          // Explicitly set isLoggedIn to ensure UI updates
          this.isLoggedInSubject.next(true);
        } else {
          this.loginErrorSubject.next(response.message || 'Login failed');
          this.isLoggedInSubject.next(false);
        }
      },
      error: (error) => {
        this.isLoggingInSubject.next(false);
        this.isLoggedInSubject.next(false);
        this.loginErrorSubject.next(error.message || 'Login request failed');
        console.error('Login error:', error);
      }
    });
  }

  onLogout(): void {
    this.authService.clearToken();
    this.signalrService.stopConnection();
  }

  async onConnectSignalR(): Promise<void> {
    await this.signalrService.startConnection();
  }

  async onDisconnectSignalR(): Promise<void> {
    await this.signalrService.stopConnection();
  }

  onClearMessages(): void {
    this.signalrService.clearMessages();
  }

  getMaskedToken(): string {
    const token = this.currentTokenSubject.value;
    if (!token) return 'No token';
    const length = token.length;
    if (length <= 20) return token.substring(0, 10) + '...';
    return token.substring(0, 15) + '...' + token.substring(length - 10);
  }
}