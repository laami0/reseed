import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { RegisterService } from '../../services/register.service';
import { BackbuttonComponent } from '../../components/backbutton/backbutton.component';
import { MainButtonComponent } from '../../components/main-button/main-button.component';
import {Router} from '@angular/router';
import {TextfieldComponent} from '../../components/textfield/textfield.component';
import {FlowerheadComponent} from '../../components/flowerhead/flowerhead.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BackbuttonComponent,
    MainButtonComponent,
    FlowerheadComponent,
    TextfieldComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  user: User = {
    user_number: 0,
    name: '',
    email: '',
    password: '',
  };

  constructor(private registerService: RegisterService, private Router: Router) {}

  confirmPassword = '';
  registrationSuccess = false;
  errorMessage = '';

  onSubmit() {
    this.errorMessage = '';
    this.registrationSuccess = false;

    if (!this.user.name || !this.user.email || !this.user.password || !this.confirmPassword) {
      this.errorMessage = 'Bitte alle Felder ausfüllen.';
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Die Passwörter stimmen nicht überein.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
      this.errorMessage = 'Ungültige E-Mail-Adresse.';
      return;
    }

    this.registerService.registerUser(this.user).subscribe({
      next: (response) => {
        this.registrationSuccess = true;

        sessionStorage.setItem('user', JSON.stringify(response.user));
        this.Router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        this.registrationSuccess = false

        //Der Errorcode gibt Hinweis darauf, welcher Inhalt zum Fehler geführt hat
        if(error.status === 501) this.user.email = '';
        if(error.status === 502) this.user.name = '';

        // Zurücksetzen
        this.user.password = '';
        this.confirmPassword = '';
      }
    });
  }
}
