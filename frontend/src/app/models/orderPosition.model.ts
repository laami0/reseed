import {Order} from './order.model';
import {Seed} from './seed.model';

export interface OrderPosition {
  position_number?: number;
  order: Order;
  seed: Seed;
  amount: number;
}
