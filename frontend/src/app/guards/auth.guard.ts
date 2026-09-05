import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CheckoutService } from '../services/checkout.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const checkoutService = inject(CheckoutService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const hasCartItems = checkoutService.getShoppingCartSize() > 0;


  if (!isLoggedIn) {
    return router.parseUrl('/login');
  } else if (!hasCartItems) {
    return router.parseUrl('/warenkorb');
  } else {
    return true;
  }
};
