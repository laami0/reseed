import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextButtonSliderComponent } from './next-button-slider.component';

describe('NextButtonSliderComponent', () => {
  let component: NextButtonSliderComponent;
  let fixture: ComponentFixture<NextButtonSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextButtonSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextButtonSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
