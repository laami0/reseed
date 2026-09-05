import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from '../../components/footer/footer.component';
import {FlowerheadComponent} from '../../components/flowerhead/flowerhead.component';
import {SaatgutTileComponent} from '../../components/saatgut-tile/saatgut-tile.component';
import {CommonModule} from '@angular/common';
import {NextButtonSliderComponent} from '../../components/next-button-slider/next-button-slider.component';
import {ChartComponent} from '../../components/chart/chart.component';
import { AuthService } from '../../services/auth.service';
import {User} from '../../models/user.model';
import {ProfileService} from '../../services/profile.service';
import { Rent } from '../../models/rent.model';
import { CanActivate } from '@angular/router';
import { BeetComponent } from '../../components/beet/beet.component';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, BeetComponent, FooterComponent, FlowerheadComponent, SaatgutTileComponent, CommonModule, NextButtonSliderComponent, ChartComponent],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements CanActivate, OnInit {
  visibleStart = 0;
  visibleCount = 4;
  currentUser: User | null = null;
  plantedSeeds: Rent[] = [];
  backSeeds: Rent[] = [];

  constructor(private authService: AuthService, private profileService: ProfileService) {
    this.currentUser = this.authService.getUser();
  }

  canActivate(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    if (this.currentUser?.user_number) {
      this.loadRentData(this.currentUser);
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (!user?.user_number) {
        this.plantedSeeds = [];
        this.backSeeds = [];
        return;
      }

      this.loadRentData(user);
    });
  }

  private loadRentData(user: User): void {
    this.profileService.getRent(user.user_number).subscribe({
      next: (result) => {
        const rents = result?.rents ?? [];

        this.plantedSeeds = rents
          .filter(item => item.status === 'angepflanzt')
          .map(item => ({
            user,
            rent_number: item.rent_number,
            order_number: item.order_number,
            status: item.status,
            created_at: item.created_at,
            seed: {
              seed_number: item.seed_number,
              dt_name: item.dt_name,
              lt_name: item.lt_name,
              description: item.description,
              stock: 0,
              water: '',
              plant_time: '',
              climate: '',
              sun: false,
              growth_weeks: item.growth_weeks,
              category_names: item.category_names
            }
          }));

        this.backSeeds = rents
          .filter(item => item.status === 'zurueckgegeben')
          .map(item => ({
            user,
            rent_number: item.rent_number,
            order_number: item.order_number,
            status: item.status,
            seed: {
              seed_number: item.seed_number,
              dt_name: item.dt_name,
              lt_name: item.lt_name,
              description: item.description,
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
      error: () => {
        this.plantedSeeds = [];
        this.backSeeds = [];
      }
    });
  }

  get visibleSeeds() {
    return this.backSeeds.slice(this.visibleStart, this.visibleStart + this.visibleCount);
  }

  nextSlide() {
    if (this.visibleStart + this.visibleCount < this.backSeeds.length) {
      this.visibleStart++;
    }
  }

  prevSlide() {
    if (this.visibleStart > 0) {
      this.visibleStart--;
    }
  }
}
