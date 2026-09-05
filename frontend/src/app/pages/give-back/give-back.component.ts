import {Component} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {FlowerheadComponent} from '../../components/flowerhead/flowerhead.component';
import {FooterComponent} from '../../components/footer/footer.component';
import {DropdownComponent} from '../../components/dropdown/dropdown.component';
import {MainButtonComponent} from '../../components/main-button/main-button.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RueckgabeService} from './rueckgabe.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user.model';
import {Rent} from '../../models/rent.model';

@Component({
  selector: 'app-give-back',
  standalone: true,
  imports: [
    HeaderComponent,
    FlowerheadComponent,
    FooterComponent,
    DropdownComponent,
    MainButtonComponent,
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./give-back.component.scss'],
  templateUrl: './give-back.component.html',
})
export class GiveBackComponent {
  options = ['Bremen', 'Hamburg', 'Hannover'];
  selectedOption: string | null = null;
  currentUser!: User;
  errorMessage = '';
  rentNumber: number;
  plant_name = "";

  constructor(
    private authService: AuthService,
    private rueckgabeService: RueckgabeService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getUser()!;
    this.rentNumber = Number(this.router.url.replace("/give-back/", ""));

    this.rueckgabeService.getRent(this.rentNumber).subscribe({
      next: (res) => {
        this.plant_name = res.seed.dt_name;
      },
      error: (err) => {
        console.error('Fehler beim Get Ausleihe:', err);
      }
    });
  }

  onSelectionChange(option: string) {
    this.selectedOption = option;
  }

  onZurueckgeben() {
    this.rueckgabeService.zurueckgeben(this.rentNumber).subscribe({
      next: (res: any) => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Fehler beim Zurückgeben.';
      }
    });
  }

  onNoSeeds() {
    this.rueckgabeService.noSeeds(this.rentNumber).subscribe({
      next: (res: any) => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Fehler beim Zurückgeben.';
      }
    });
  }
}
