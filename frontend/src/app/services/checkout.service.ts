import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Address} from '../models/address.model';
import {User} from '../models/user.model';
import {AuthService} from './auth.service';
import {Order} from '../models/order.model';
import {CartService} from './cart.service';
import {CartItem} from '../models/cartItem.model';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {OrderPosition} from '../models/orderPosition.model';
import {Seed} from '../models/seed.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  currentUser: User;
  cartItems: CartItem[] = [];
  currentAddress: Address | null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.currentUser = this.authService.getUser()!;
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    this.currentAddress = this.getAddress();
  }

  getShoppingCartSize(): number {
    return this.cartItems.length;
  }

  addAddress(address: Address) {
    return this.http.post<{ address: Address }>('http://localhost:3000/address', address);
  }

  saveAddress(address: Address) {
    if (!address) return;
    sessionStorage.setItem('address', JSON.stringify(address));
  }

  removeAddress() {
    sessionStorage.removeItem('address');
  }

  getAddress(): Address | null {
    const stored = sessionStorage.getItem('address');
    if (!stored || stored === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Fehler beim Parsen der gespeicherten Adresse:', e);
      return null;
    }
  }

  async placeOrder(address: Address, deliveryType: string) {
    const sufficient = await this.checkStockSufficiency();

    if (sufficient) {
      const order: Order = {
        user: this.currentUser,
        address: address,
        delivery_type: deliveryType
      };

      this.createOrder(order, this.cartItems).subscribe({
        next: (response) => {
          this.removeAddress();
          this.cartService.clearCart();
          this.router.navigate(['/confirmation', response.order.order_number]);
        },
        error: (error) => {
          console.error('Fehler beim Bestellen:', error);
        }
      });

    } else {
      const insufficientCartItems = await this.getInsufficientStockItems();

      for (const item of insufficientCartItems) {
        this.cartService.removeItem(item.id);
      }

      console.error('Nicht genug Bestand vorhanden.');
      this.router.navigate(['/warenkorb'], {
        state: { errorMessage: 'Der Bestand von Saatgut in deinem Warenkorb hat sich verändert. Dein Warenkorb wurde aktualisiert.' }
      });
    }
  }

  getStock(seed_number: number) {
    return this.http.get<{ stock: number }>(`http://localhost:3000/seeds/${seed_number}/stock`);
  }

  async checkStockSufficiency(): Promise<boolean> {
    const checks = this.cartItems.map(async item => {
      const res = await firstValueFrom(this.getStock(item.seed.seed_number));
      return item.quantity <= res.stock;
    });

    const results = await Promise.all(checks);
    return results.every(valid => valid);
  }

  async getInsufficientStockItems(): Promise<CartItem[]> {
    const failedItems: CartItem[] = [];

    for (const item of this.cartItems) {
      const res = await firstValueFrom(this.getStock(item.seed.seed_number));
      if (item.quantity > res.stock) {
        failedItems.push(item);
      }
    }

    return failedItems;
  }

  createOrder(order: Order, cartItems: CartItem[]) {
    return this.http.post<{ order: Order }>('http://localhost:3000/order', {order, cartItems});
  }

  getOrderPosition(order_number: String) {
    return this.http.get<{ orderPositions: any[] }>(`http://localhost:3000/order-positions/${order_number}`);
  }

  getOrder(order_number: string){
    return this.http.get<{order: Order}>(`http://localhost:3000/get-order/${order_number}`);
  }
}
