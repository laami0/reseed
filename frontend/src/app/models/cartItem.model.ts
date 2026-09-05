import { Seed } from './seed.model';

export interface CartItem {
  id: number;
  seed: Seed;
  quantity: number;
}
