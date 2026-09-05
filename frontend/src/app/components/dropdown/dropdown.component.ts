import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() label = 'Poststation';
  @Input() options: string[] = [];
  @Input() selected: string | null = null;
  @Output() selectionChange = new EventEmitter<string>();

  isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  selectOption(option: string) {
    this.selectionChange.emit(option);
    this.isOpen.set(false);
  }
}
