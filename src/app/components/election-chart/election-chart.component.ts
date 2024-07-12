import { Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';

import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from 'ng-apexcharts';
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-election-chart',
  standalone: true,
  imports: [NgApexchartsModule, NgIf],
  templateUrl: './election-chart.component.html',
  styleUrl: './election-chart.component.scss',
})
export class ElectionChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  ngOnInit(): void {}

  constructor() {
    this.chartOptions = {
      series: [70, 30],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['MACRON', 'LEPEN'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
}
