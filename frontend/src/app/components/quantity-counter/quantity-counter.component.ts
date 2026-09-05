import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CartItem } from '../../models/cartItem.model';
import { CartService } from '../../services/cart.service';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { MainButtonComponent } from '../main-button/main-button.component';

@Component({
  selector: 'app-quantity-counter',
  standalone: true,
  templateUrl: './quantity-counter.component.html',
  imports: [
    NgSwitch,
    NgSwitchCase,
    MainButtonComponent
  ],
  styleUrls: ['./quantity-counter.component.scss']
})
export class QuantityCounterComponent implements OnInit{
  @Input() type: 'checkout' | 'detailpage' = 'checkout';
  @Input() item!: CartItem;
  @Output() valueChange = new EventEmitter<number>();

  tempQuantity = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const existingItem = this.item?.seed?.seed_number
      ? this.cartService.getItemBySeedId(this.item.seed.seed_number)
      : undefined;

    if (existingItem) {
      this.item.quantity = existingItem.quantity;
    }

    this.tempQuantity = this.item.quantity;
  }

  incrementCheckout(): void {
    const bestand = this.item.seed?.stock ?? 0;

    const cartItem = this.cartService.getItemBySeedId(this.item.seed?.seed_number ?? -1);
    const currentQuantity = cartItem?.quantity ?? 0;

    if (currentQuantity < bestand) {
      this.item.quantity++;
      this.valueChange.emit(this.item.quantity);
      this.cartService.updateQuantity(this.item.id, this.item.quantity);
    } else {
      console.warn(`Maximale Menge erreicht: ${bestand}`);
    }
  }

  decrementCheckout(): void {
    if (this.item.quantity > 0) {
      this.item.quantity--;
      this.valueChange.emit(this.item.quantity);
      this.cartService.updateQuantity(this.item.id, this.item.quantity);
    }
  }

  incrementNumber(): void {
    const bestand = this.item.seed?.stock ?? 0;
    if (this.tempQuantity < bestand) {
      this.tempQuantity++;
    }
  }

  decrementNumber(): void {
    if (this.tempQuantity > 0) {
      this.tempQuantity--;
    }
  }

  saveQuantity(): void {
    const stock = this.item.seed?.stock ?? 0;

    const existingItem = this.cartService.getItemBySeedId(this.item.seed?.seed_number ?? -1);
    const alreadyInCart = existingItem?.quantity ?? 0;

    const desiredQuantity = this.tempQuantity;
    const totalRequested = alreadyInCart + desiredQuantity;

    let allowedQuantity = desiredQuantity;

    if (totalRequested > stock) {
      allowedQuantity = stock - alreadyInCart;
      console.warn(`Maximum quantity reached. Only ${allowedQuantity} more items can be added.`);
    }

    if (allowedQuantity > 0) {
      const updatedItem = { ...this.item, quantity: allowedQuantity };
      this.cartService.addItem(updatedItem);
      this.valueChange.emit(alreadyInCart + allowedQuantity);
    } else {
      console.warn('No more items available to add.');
    }

    this.cartService.cartItems$.subscribe(items => {
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.tempQuantity = 0;
  }
}
