import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export type CheckboxState = 'selected' | 'unselected';

@Component({
  selector: 'app-selection',
  imports: [CommonModule],
  templateUrl: './selection.component.html',
  standalone: true,
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent {
  @Input() type: 'checkbox' | 'radio' = 'checkbox';

  @Input() label: string = '';
  @Input() state: CheckboxState = 'unselected';
  @Output() stateChange = new EventEmitter<CheckboxState>();

  @Input() labelTitle: string = '';
  @Input() labelInfo: string = '';
  @Input() labelCarrier: string = '';

  toggle() {
    this.state = this.state === 'selected' ? 'unselected' : 'selected';
    this.stateChange.emit(this.state);
  }
}
