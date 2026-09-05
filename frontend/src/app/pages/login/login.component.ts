import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BackbuttonComponent } from '../../components/backbutton/backbutton.component';
import { MainButtonComponent } from '../../components/main-button/main-button.component';
import { TextfieldComponent } from '../../components/textfield/textfield.component';
import {FlowerheadComponent} from '../../components/flowerhead/flowerhead.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BackbuttonComponent,
    MainButtonComponent,
    TextfieldComponent,
    FlowerheadComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  user: User = {
    user_number: 0,
    name: '',
    email: '',
    password: '',
  };
  errorMessage = '';

  constructor(private AuthService: AuthService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? history.state;

    this.errorMessage = state?.['errorMessage'] ?? '';
  }

  @Output() login = new EventEmitter<User>();

  onSubmit() {
    this.errorMessage = '';

    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Bitte Benutzername/Email und Passwort eingeben.';
      return;
    }

    this.login.emit(this.user);

    this.AuthService.getUserData(this.user.email, this.user.password).subscribe({
      next: (response: { user: User }) => {
        this.AuthService.login(response.user);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = 'Login fehlgeschlagen: ' + error.error.message;
        this.user.password = '';
      }
    });

  }
}
