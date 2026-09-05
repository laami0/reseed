import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import { AuthService } from '../../services/auth.service';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-navigation-layout',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './navigation-layout.component.html',
  standalone: true,
  styleUrl: './navigation-layout.component.scss'
})

export class NavigationLayoutComponent {
  @Input() cartItemCount: number = 0;
  isLoggedIn = false;

  constructor(private authService: AuthService, private cartService: CartService, private router: Router) {
    this.isLoggedIn = !!this.authService.getUser();
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.length;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
