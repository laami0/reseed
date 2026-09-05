import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-saatgut-tile',
  imports: [
    RouterLink
  ],
  templateUrl: './saatgut-tile.component.html',
  standalone: true,
  styleUrl: './saatgut-tile.component.scss'
})
export class SaatgutTileComponent {
  @Input() seedId!: number;  // oder number, je nachdem
  @Input() seedTitle: string | undefined;
  @Input() seedDescription: string | undefined;
  @Input() seedCategory: string | undefined;
}
