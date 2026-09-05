import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private socket = io('http://localhost:3000');
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    const savedUser = this.loadUserFromSession();
    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser);
    this.currentUser$ = this.currentUserSubject.asObservable().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  // Login request to backend
  getUserData(name_or_email: string, password: string): Observable<{ user: User }> {
    return this.http.post<{ user: User }>('http://localhost:3000/login', { name_or_email, password });
  }

  // Save user in session and update observable
  login(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Remove user from session and update observable
  logout(): void {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('address');
    this.currentUserSubject.next(null);
  }

  // Getter for current user
  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  // Load user from session on init
  private loadUserFromSession(): User | null {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  // Listen for new user events via socket
  onNewUser(): Observable<User> {
    return new Observable(observer => {
      this.socket.on('new-user', (user: User) => observer.next(user));
    });
  }
}
