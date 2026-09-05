import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-next-button-slider',
  imports: [
    NgClass
  ],
  templateUrl: './next-button-slider.component.html',
  standalone:true,
  styleUrl: './next-button-slider.component.scss'
})
export class NextButtonSliderComponent {
  @Input() direction: 'left' | 'right' = 'right';

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit(); //braucht man weil sonst der klick auf den anderen Seiten nicht erkannt wird
  }

}
