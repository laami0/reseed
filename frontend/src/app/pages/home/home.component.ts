import { Component } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {FlowerheadComponent} from '../../components/flowerhead/flowerhead.component';
import {MainButtonComponent} from '../../components/main-button/main-button.component';
import {FooterComponent} from '../../components/footer/footer.component';
import {RouterLink, RouterLinkActive} from "@angular/router";



@Component({
  selector: 'app-home',
    imports: [
        HeaderComponent,
        FlowerheadComponent,
        MainButtonComponent,
        FooterComponent,
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
