import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerheadComponent } from './flowerhead.component';

describe('FlowerheadComponent', () => {
  let component: FlowerheadComponent;
  let fixture: ComponentFixture<FlowerheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowerheadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowerheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
