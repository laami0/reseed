import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent, HttpClientTestingModule]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load chart data from backend', () => {
    const request = httpTestingController.expectOne('http://localhost:3000/planting-chart');

    expect(request.request.method).toBe('GET');

    request.flush([
      { label: 'Jan', value: 2 },
      { label: 'Feb', value: 5 }
    ]);

    expect(component.config.data.labels).toEqual(['Jan', 'Feb']);
    expect(component.config.data.datasets[0].data).toEqual([2, 5]);
  });
});
