import {Seed} from './seed.model';
import {User} from './user.model';

export interface Rent {
  rent_number: number
  order_number: number
  seed: Seed;
  user: User;
  status: string; //angepflanzt, zurückgegeben, kein Saatgut
  created_at?: string;
}

// wenn man 1 Tomate im Januar kauft dann kommt bei Profil momentan angepflanzt eine Tomate hin. (aber wenn 2 mal Tomate im januar dann nur eine)
//wenn man 1 Tomate im Februar kauft dann kommt bei Profil momentan angepflanzt eine neue Tomate dazu. (weil die ja nicht so viel
// gewachsen ist wie die im Januar)
