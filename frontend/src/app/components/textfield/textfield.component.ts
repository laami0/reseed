import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textfield',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.scss'
})
export class TextfieldComponent {
  @Input() label = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() length: 'short' | 'long' = 'short';
  @Input() placeholder: string = '';
  @Input() value: any;

  @Output() valueChange = new EventEmitter<any>();

  onInput(): void {
    this.valueChange.emit(this.value);
  }
}
