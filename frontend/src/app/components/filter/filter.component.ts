import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { SelectionComponent, CheckboxState} from '../selection/selection.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-filter',
  imports: [SelectionComponent, CommonModule],
  templateUrl: './filter.component.html',
  standalone: true,
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit{
  public filterData = [
    {
      title: 'Kategorien',
      options: [
        { label: 'Kräuter', state: 'unselected' as CheckboxState },
        { label: 'Gemüse', state: 'unselected' as CheckboxState },
        { label: 'Blumen', state: 'unselected' as CheckboxState },
        { label: 'Früchte', state: 'unselected' as CheckboxState },
        { label: 'Getreide', state: 'unselected' as CheckboxState },
        { label: 'Ursaat', state: 'unselected' as CheckboxState },
      ]
    },
    {
      title: 'Aussaatzeit',
      options: [
        { label: 'Frühling', state: 'unselected' as CheckboxState },
        { label: 'Sommer', state: 'unselected' as CheckboxState },
        { label: 'Herbst', state: 'unselected' as CheckboxState },
        { label: 'Winter', state: 'unselected' as CheckboxState },
      ]
    },
    {
      title: 'Wasserbedarf',
      options: [
        { label: 'Viel', state: 'unselected' as CheckboxState },
        { label: 'Mittel', state: 'unselected' as CheckboxState },
        { label: 'Wenig', state: 'unselected' as CheckboxState },
      ]
    },
    {
      title: 'Klima',
      options: [
        { label: 'Kühl', state: 'unselected' as CheckboxState },
        { label: 'Gemäßigt', state: 'unselected' as CheckboxState },
        { label: 'Warm', state: 'unselected' as CheckboxState },
      ]
    },
    {
      title: 'Sonne',
      options: [
        { label: 'Sonnig', state: 'unselected' as CheckboxState },
        { label: 'Schatten', state: 'unselected' as CheckboxState },
      ]
    },
  ];

  @Output() notify = new EventEmitter<object>();
  onStateChange(section: string, label: string, newState: CheckboxState) {
    const category = this.filterData.find(c => c.title === section);
    const item = category?.options.find(o => o.label === label);
    if (item) item.state = newState;
    this.notify.emit(this.filterData);
  }

  ngOnInit(): void {
    this.notify.emit(this.filterData);
  }
}
