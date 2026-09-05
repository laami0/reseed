import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-backbutton',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './backbutton.component.html',
  styleUrl: './backbutton.component.scss'
})

export class BackbuttonComponent {
  @Input() theme: 'light' | 'dark' = 'light'; // default is light

  get imagePath(): string {
    return this.theme === 'dark' ? 'logo_dark.svg' : 'logo_light.svg';
  }

  goBack() {
    window.history.back();
  }
}
