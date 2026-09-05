import {Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Rent} from '../../models/rent.model';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user.model';
import {MainButtonComponent} from '../main-button/main-button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-beet',
  standalone: true,
  imports: [CommonModule, MainButtonComponent],
  templateUrl: './beet.component.html',
  styleUrl: './beet.component.scss'
})
export class BeetComponent {

  currentUser: User;
  @Input() rentListe: Rent[] = [];

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.getUser()!;
  }

  berechneStadium(
    createdAt: string,
    growthWeeks: number
  ): number {
    const plantedDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - plantedDate.getTime();
    const weeksPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    const half = growthWeeks / 2;

    if (weeksPassed <= half) {
      return 10;
    }
    if (weeksPassed <= growthWeeks) {
      return 20;
    }
    return 30;
  }

  giveBack(rent_number: number) {
    this.router.navigate(['/give-back', rent_number]);
  }

  protected readonly Number = Number;
}
