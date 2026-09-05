import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  standalone: true,
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {
  @Input() type: 'a' | 'b'  = 'a';

  @Output() notify = new EventEmitter<string>();

  searchText = "";

  onChange() {
    this.notify.emit(this.searchText);
  }
}
