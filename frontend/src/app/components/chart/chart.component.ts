import { Component, AfterViewInit, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface PlantingChartEntry {
  label: string;
  value: number;
}

@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.component.html',
  standalone: true,
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() userNumber?: number;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  public config: any = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Pro Monat angepflanzt',
          data: [0],
          borderColor: '#818F66',
          fill: false,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    }
  };

  chart: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userNumber'] && this.userNumber !== undefined) {
      this.loadChartData();
    }
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    if (!this.chart && this.chartCanvas) {
      this.chart = new Chart(this.chartCanvas.nativeElement, this.config);
    }
  }

  private loadChartData(): void {
    const params = this.userNumber !== undefined
      ? new HttpParams().set('user_number', this.userNumber.toString())
      : new HttpParams();

    this.http.get<PlantingChartEntry[]>('http://localhost:3000/planting-chart', { params }).subscribe({
      next: (response: PlantingChartEntry[]) => {
        const labels = response.length ? response.map((item: PlantingChartEntry) => item.label) : ['Keine Daten'];
        const data = response.length ? response.map((item: PlantingChartEntry) => item.value) : [0];

        this.config.data.labels = labels;
        this.config.data.datasets[0].data = data;

        if (this.chart) {
          this.chart.data.labels = labels;
          this.chart.data.datasets[0].data = data;
          this.chart.update();
        } else {
          this.createChart();
          this.chart.data.labels = labels;
          this.chart.data.datasets[0].data = data;
          this.chart.update();
        }
      },
      error: () => {
        this.config.data.labels = ['Keine Daten'];
        this.config.data.datasets[0].data = [0];

        if (this.chart) {
          this.chart.data.labels = ['Keine Daten'];
          this.chart.data.datasets[0].data = [0];
          this.chart.update();
        }
      }
    });
  }
}
