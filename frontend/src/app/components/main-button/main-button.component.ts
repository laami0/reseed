import {Component, Input, Output, EventEmitter} from '@angular/core';

// Component Logic and properties

@Component({
  selector: 'app-main-button',
  imports: [],
  templateUrl: './main-button.component.html',
  standalone: true,
  styleUrl: './main-button.component.scss'
})
export class MainButtonComponent {

  @Input() ButtonText: string | undefined;

}
