import { Routes } from '@angular/router';
import { NavigationLayoutComponent } from './layouts/navigation-layout/navigation-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: NavigationLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      {
        path: 'saatgut',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/saatgut/saatgut.component').then(
                m => m.SaatgutComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/saatgut-detail/saatgut-detail.component').then(
                m => m.SaatgutDetailComponent
              ),
          },
        ],
      },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'warenkorb', loadComponent: () => import('./pages/warenkorb/warenkorb.component').then(m => m.WarenkorbComponent) },
      { path: 'give-back',
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/give-back/give-back.component').then(
                m => m.GiveBackComponent
              ),
          }
        ]
      },
      { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [authGuard] },
      { path: 'confirmation',
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/confirmation/confirmation.component').then(
                m => m.ConfirmationComponent
              ),
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) }
    ]
  }
];
