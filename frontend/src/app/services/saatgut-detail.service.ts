import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Seed } from '../models/seed.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SaatgutDetailService {
  private socket = io('http://localhost:3000');

  constructor(private http: HttpClient, private router: Router) {}

  getSaatgut(){
    return this.http.get<Seed>('http://localhost:3000/saatgut-detail/' + this.router.url.replace("/saatgut/", ""));
  }
}
