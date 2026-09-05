import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {FlowerheadComponent} from '../../components/flowerhead/flowerhead.component';
import {Order} from '../../models/order.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForOf} from '@angular/common';
import {CheckoutService} from '../../services/checkout.service';
import {OrderPosition} from '../../models/orderPosition.model';
import {FooterComponent} from '../../components/footer/footer.component';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    HeaderComponent,
    FlowerheadComponent,
    NgForOf,
    FooterComponent
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {
  currentUser: User;
  order: Order = {
    address: {
      first_name: '',
      last_name: '',
      email: '',
      addition: '',
      city: '',
      plz: 0,
      street: ''
    },
    delivery_type: "",
    user: {
      user_number: 0,
      name: '',
      email: '',
      password: ''
    }
  };
  orderPositions!: OrderPosition[];

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private checkoutService: CheckoutService) {
    this.currentUser = this.authService.getUser()!;
  }

  ngOnInit() {
    const url = this.router.url; // "/confirmation/60" zum Beispiel
    const orderNumber = url.replace("/confirmation/", "");

    if (!orderNumber) {
      this.router.navigate(['/home']);
    }

    this.checkoutService.getOrder(orderNumber).subscribe({
      next: (res) => {
        this.order = res.order;
      },
      error: (err) => {
        console.error('Fehler beim Bestellen:', err);
      }
    })

    this.checkoutService.getOrderPosition(orderNumber).subscribe({
      next: (res) => {
        this.orderPositions = res.orderPositions.map(item => ({
          position_number: item.position_number,
          amount: item.amount,
          order: this.order,
          seed: {
            seed_number: item.seed_number,
            dt_name: item.dt_name,
            lt_name: item.lt_name,
            description: '',
            stock: 0,
            water: '',
            plant_time: '',
            climate: '',
            sun: false,
            growth_weeks: 0,
            category_names: item.category_names
          }
        }));
      },
      error: (err) => {
        console.error('Fehler beim Get Bestellpositionen:', err);
      }
    });
  }

  backHome() {

  }
}

