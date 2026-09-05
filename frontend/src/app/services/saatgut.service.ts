import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {HttpClient} from '@angular/common/http';
import {Seed} from '../models/seed.model';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class SaatgutService {
  private socket = io('http://localhost:3000');

  constructor(private http: HttpClient) {}

  getSaatgut(){
    return this.http.get<Seed[]>('http://localhost:3000/saatgut');
  }

  onStockUpdate(): Observable<Seed> {
    return new Observable(observer => {
      this.socket.on('new-stock', (seed: Seed) => observer.next(seed));
    });
  }
}
