import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { BackbuttonComponent } from '../../components/backbutton/backbutton.component';
import { FlowerheadComponent } from '../../components/flowerhead/flowerhead.component';
import { FormsModule } from '@angular/forms';
import { MainButtonComponent } from '../../components/main-button/main-button.component';
import { TextfieldComponent } from '../../components/textfield/textfield.component';
import { Address } from '../../models/address.model';
import { SelectionComponent, CheckboxState } from '../../components/selection/selection.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgIf } from '@angular/common';
import { CheckoutService } from '../../services/checkout.service';
import { AuthService } from '../../services/auth.service';
import { CanActivate } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    HeaderComponent,
    BackbuttonComponent,
    FlowerheadComponent,
    FormsModule,
    MainButtonComponent,
    TextfieldComponent,
    SelectionComponent,
    FooterComponent,
    NgIf
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements CanActivate {
  address: Address = {
    first_name: '',
    last_name: '',
    email: '',
    street: '',
    addition: '',
    plz: 0,
    city: ''
  };
  errorMessage = '';
  deliveryType = 'standard';
  lastCheckboxState = '';

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  constructor(private checkoutService: CheckoutService, private authService:AuthService) {
    const savedAddress = this.checkoutService.getAddress();
    if (savedAddress) {
      this.address = savedAddress;
    }
  }

  canActivate(): boolean {
    return this.authService.isLoggedIn() && this.checkoutService.getShoppingCartSize() > 0; // Nur wenn true, wird die Route geladen
  }

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.valueChange.emit(inputValue);
  }

  onStateChange(type: string, newState: CheckboxState) {
    this.lastCheckboxState = newState;
    if (newState === 'selected') {
      this.deliveryType = type;
    }
  }

  onSubmit() {
    this.errorMessage = '';

    const { first_name, last_name, email, street, addition, plz, city } = this.address;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !street ||
      !city ||
      !plz || plz === 0
    ) {
      this.errorMessage = 'Bitte fülle alle Felder aus.';
      return;
    }

    // E-Mail-Format prüfen
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage = 'Ungültige E-Mail-Adresse.';
      return;
    }

    if (this.lastCheckboxState === 'unselected') {
      this.errorMessage = 'Bitte wähle eine Versandart.';
      return;
    }

    this.checkoutService.addAddress(this.address).subscribe({
      next: (res) => {
        this.checkoutService.saveAddress(res.address);
        this.checkoutService.placeOrder(res.address, this.deliveryType);
      },
      error: (err) => {
        console.error('Fehler beim Bestellen:', err);
      }
    });
  }
}
