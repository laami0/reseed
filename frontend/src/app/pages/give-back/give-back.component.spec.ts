import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveBackComponent } from './give-back.component';

describe('SaatgutZurückschickenComponent', () => {
  let component: GiveBackComponent;
  let fixture: ComponentFixture<GiveBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveBackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
