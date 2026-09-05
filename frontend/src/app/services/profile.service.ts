import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Rent } from '../models/rent.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private socket = io('http://localhost:3000');

  constructor(private http: HttpClient) {}

  getRent(user_number: number) {
    return this.http.get<{ rents: any[] }>('http://localhost:3000/rents', {
      params: { user_number: user_number.toString() }
    });
  }

}
