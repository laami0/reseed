import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cartItem.model';

const STORAGE_KEY = 'cart_items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: BehaviorSubject<CartItem[]>;
  cartItems$;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialItems = saved ? JSON.parse(saved) : [];
    this.cartItems = new BehaviorSubject<CartItem[]>(initialItems);
    this.cartItems$ = this.cartItems.asObservable();
  }

  private updateStorage(items: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  getItemBySeedId(seedId: number): CartItem | undefined {
    return this.cartItems.getValue().find(item => item.seed?.seed_number === seedId);
  }

  addItem(item: CartItem) {
    const items = this.cartItems.getValue();
    const index = items.findIndex(i => i.id === item.id);

    if (index > -1) {
      items[index].quantity += item.quantity;
    } else {
      items.push({ ...item });
    }

    this.cartItems.next([...items]);
    this.updateStorage(items);
  }

  updateQuantity(id: number, quantity: number) {
    const items = this.cartItems.getValue().map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    this.cartItems.next(items);
    this.updateStorage(items);
  }

  removeItem(id: number) {
    const items = this.cartItems.getValue().filter(item => item.id !== id);
    this.cartItems.next(items);
    this.updateStorage(items);
  }

  clearCart() {
    this.cartItems.next([]);
    localStorage.removeItem(STORAGE_KEY);
  }
}
