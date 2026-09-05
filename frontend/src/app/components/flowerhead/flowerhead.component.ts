import {Component, Input, AfterViewInit, HostListener, OnChanges, ChangeDetectorRef} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-flowerhead',
  standalone: true,
  imports: [NgForOf, NgClass, NgIf],
  templateUrl: './flowerhead.component.html',
  styleUrl: './flowerhead.component.scss'
})
export class FlowerheadComponent implements AfterViewInit, OnChanges {
  @Input() HeadlineText?: string;
  @Input() type: 'chauncy' | 'yorkten-demi' = 'chauncy';
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal';
  @Input() containerHeight: number = document.documentElement.scrollHeight;

  flowers: any[] = [];

  svgWidth = 40;
  svgHeight = 40 + 24;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.setFlowerCount();
  }

  @HostListener('window:resize')
  onResize() {
    this.setFlowerCount();
  }

  ngOnChanges() {
    if (this.containerHeight) {
      const count = Math.ceil(this.containerHeight / this.svgHeight);
      this.flowers = Array.from({length: count});
    }
  }

  private setFlowerCount() {
    if (this.layout === 'horizontal') {
      const screenWidth = window.innerWidth;
      const count = Math.ceil(screenWidth / this.svgWidth);
      this.flowers = Array.from({length: count});
      // Manuell Triggern, um ExpressionChanged-Fehler zu verhindern
      this.cdr.detectChanges();
    }
  }
}
