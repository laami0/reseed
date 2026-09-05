import {User} from './user.model';
import {Address} from './address.model';

export interface Order {
  order_number?: number;
  user: User;
  address: Address;
  delivery_type: string;
}
