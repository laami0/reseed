import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Order} from '../../models/order.model';
import {Seed} from '../../models/seed.model';

@Injectable({providedIn: 'root'})
export class RueckgabeService {
  constructor(private http: HttpClient) {
  }

  zurueckgeben(rent_number: number) {
    return this.http.post('http://localhost:3000/zurueckschicken', {
      rent_number
    });
  }

  noSeeds(rent_number: number) {
    return this.http.post('http://localhost:3000/give-back', {
      rent_number
    });
  }

  getRent(rent_number: number) {
    return this.http.get<{ seed: Seed }>(`http://localhost:3000/get-rent/${rent_number}`);
  }
}
