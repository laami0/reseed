import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { QuantityCounterComponent } from '../../components/quantity-counter/quantity-counter.component';
import { CartService } from '../../services/cart.service';
import { BackbuttonComponent } from '../../components/backbutton/backbutton.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NextButtonSliderComponent } from '../../components/next-button-slider/next-button-slider.component';
import { SaatgutTileComponent } from '../../components/saatgut-tile/saatgut-tile.component';
import { RouterModule, Router } from '@angular/router';
import { Seed } from '../../models/seed.model';
import { CartItem } from '../../models/cartItem.model';
import { SaatgutService } from '../../services/saatgut.service';

@Component({
  selector: 'app-saatgut-detail',
  standalone: true,
  imports: [
    CommonModule,
    QuantityCounterComponent,
    HeaderComponent,
    BackbuttonComponent,
    FooterComponent,
    NextButtonSliderComponent,
    SaatgutTileComponent,
    RouterModule
  ],
  templateUrl: './saatgut-detail.component.html',
  styleUrls: ['./saatgut-detail.component.scss']
})
export class SaatgutDetailComponent implements OnInit {

  constructor(private saatgutService: SaatgutService, private route: ActivatedRoute, private router: Router, private cartService: CartService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  saatgut! : Seed;
  saatgutListe! : Seed[];
  position!: CartItem;
  quantity: number = 0;
  visibleStart = 0;
  visibleCount = 4;

  ngOnInit() {
    const idString = this.route.snapshot.paramMap.get('id');
    const id = idString ? +idString : null;
    this.saatgutService.getSaatgut().subscribe(result => {
      this.saatgutListe = result;
      for(let i = 0; i < this.saatgutListe.length; i++) {
        if (this.saatgutListe[i].seed_number === id){
          this.saatgut = this.saatgutListe[i];
        }
      }
      this.position = {
        id: this.saatgut.seed_number,
        quantity: this.quantity,
        seed: this.saatgut
      };
    });

    //Echtzeit Updates
    this.saatgutService.onStockUpdate().subscribe(seed => {
      if (this.saatgut.seed_number == seed.seed_number) this.saatgut.stock = seed.stock;
    });
  }

  get visibleSeeds() {
    return this.saatgutListe?.slice(this.visibleStart, this.visibleStart + this.visibleCount);
  }

  nextSlide() {
    if (this.visibleStart + this.visibleCount < this.saatgutListe.length) {
      this.visibleStart++;
    }
  }

  prevSlide() {
    if (this.visibleStart > 0) {
      this.visibleStart--;
    }
  }

}
