import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaatgutDetailComponent } from './saatgut-detail.component';

describe('SaatgutDetailComponent', () => {
  let component: SaatgutDetailComponent;
  let fixture: ComponentFixture<SaatgutDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaatgutDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaatgutDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
