import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaatgutTileComponent } from './saatgut-tile.component';

describe('SaatgutTileComponent', () => {
  let component: SaatgutTileComponent;
  let fixture: ComponentFixture<SaatgutTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaatgutTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaatgutTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
