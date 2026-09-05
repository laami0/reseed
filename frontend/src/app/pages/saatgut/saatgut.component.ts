import { CommonModule } from '@angular/common';
import { SaatgutService } from '../../services/saatgut.service';
import { Seed } from '../../models/seed.model';
import { FilterComponent } from '../../components/filter/filter.component';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import {AfterViewInit, Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { SaatgutTileComponent } from '../../components/saatgut-tile/saatgut-tile.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { FlowerheadComponent } from '../../components/flowerhead/flowerhead.component';

@Component({
  selector: 'app-saatgut',
  imports: [
    FilterComponent,
    SaatgutTileComponent,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    SearchbarComponent,
    FooterComponent,
    FlowerheadComponent
  ],
  templateUrl: './saatgut.component.html',
  standalone: true,
  styleUrl: './saatgut.component.scss'
})
export class SaatgutComponent implements OnInit, AfterViewInit{
  saatgutListe:Seed[] = []//Liste mit allem Saatgut
  saatgutListeFiltered: Seed[] = []// Nur das Saatgut das tatsächlich angezeigt werden soll

  @Input() cartItemCount: number = 0;
  flowerContainerHeight: number = document.documentElement.scrollHeight;
  @ViewChild('filterContainer') filterContainerRef!: ElementRef;

  constructor(private saatgutService: SaatgutService, private cartService: CartService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.flowerContainerHeight = this.filterContainerRef?.nativeElement?.offsetHeight;
    // Manuell Triggern, um ExpressionChanged-Fehler zu verhindern
    this.cdr.detectChanges();
  }


  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.length;
    });
    this.saatgutService.getSaatgut().subscribe(result => {
      this.saatgutListe = result;
      this.saatgutListeFiltered = this.saatgutListe;
    });
  }

  filterData = []

  onFilterChange(filterData: any) {
    this.filterData = filterData;
    this.filter()
  }

  searchText = "";

  onSearchBarChange($event: string) {
    this.searchText = $event.toLowerCase();
    this.filter()
  }

  filter(){
    this.saatgutListeFiltered = this.saatgutListe.slice();
    for(let i = 0; i < this.saatgutListeFiltered.length; i++) {

      let saatgut = this.saatgutListeFiltered[i];

      //Filterkriterien
      const filtered1 = this.isFiltered(saatgut.category_names, 0);
      const filtered2 = this.isFiltered(saatgut.plant_time, 1);
      const filtered3 = this.isFiltered(saatgut.water, 2);
      const filtered4 = this.isFiltered(saatgut.climate, 3);
      const filtered5 = this.isFiltered(saatgut.sun ? "Sonnig" : "Schatten", 4);
      const gefiltert = filtered1 || filtered2 || filtered3 || filtered4 || filtered5;

      //Suchkriterien
      const contains1 = saatgut.dt_name.toLowerCase().includes(this.searchText);
      const contains2 = saatgut.lt_name.toLowerCase().includes(this.searchText);
      const contains3 = saatgut.description.toLowerCase().includes(this.searchText);
      const contains4 = saatgut.category_names.toLowerCase().includes(this.searchText);
      const gesucht = contains1 || contains2 || contains3 || contains4 || this.searchText === "";

      if (gefiltert || !gesucht) {
        //Saatgut wird herausgefiltert
        this.saatgutListeFiltered.splice(i, 1);
        i--;
      }
    }
  }

  //Schaut, ob das Saatgut eines der ausgewählten Filter hat. Gibt auch true, wenn kein Filter in dieser Kategorie ausgewählt wurde.
  isFiltered(saatgutAttribute: any, filterDataIndex :number){
    let used = false;//Ob überhaupt ein Filter ausgewählt wurde
    let valid = false;//Ob dieses Saatgut den Filterkriterien entspricht
    // @ts-ignore
    for (const category of this.filterData[filterDataIndex].options) {
      if (category.state === "unselected") continue;
      used = true;
      if (saatgutAttribute.includes(category.label)) valid = true;
    }
    return (!valid && used)
  }
}
