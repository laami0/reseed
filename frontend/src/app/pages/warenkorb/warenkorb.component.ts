import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { BackbuttonComponent } from '../../components/backbutton/backbutton.component';
import { CartService } from '../../services/cart.service';
import { CartItem as CartItem } from '../../models/cartItem.model';
import { MainButtonComponent } from '../../components/main-button/main-button.component';
import { QuantityCounterComponent } from '../../components/quantity-counter/quantity-counter.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';
import {FlowerheadComponent} from '../../components/flowerhead/flowerhead.component';

@Component({
  selector: 'app-warenkorb',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BackbuttonComponent,
    MainButtonComponent,
    QuantityCounterComponent,
    FooterComponent,
    FlowerheadComponent
  ],
  templateUrl: './warenkorb.component.html',
  styleUrl: './warenkorb.component.scss'
})
export class WarenkorbComponent implements OnInit {
  cartItems: CartItem[] = [];
  errorMessage = '';

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? history.state;

    this.errorMessage = state?.['errorMessage'] ?? '';
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeItem(item.id)
  }

  handleCheckoutNextStep() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login'], {
        state: { errorMessage: 'Du musst angemeldet sein, um bestellen zu können.' }
      });
    }
  }
}
