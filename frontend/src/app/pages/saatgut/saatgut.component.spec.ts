import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaatgutComponent } from './saatgut.component';

describe('SaatgutComponent', () => {
  let component: SaatgutComponent;
  let fixture: ComponentFixture<SaatgutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaatgutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaatgutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
