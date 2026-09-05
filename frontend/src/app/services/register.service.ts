import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {

  constructor(private http: HttpClient) {}

  registerUser(user: User) {
    return this.http.post<{ user: User }>('http://localhost:3000/register', user);
  }

}
