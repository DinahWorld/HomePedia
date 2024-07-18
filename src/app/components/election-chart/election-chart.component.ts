import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
export class ElectionChartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() macron: number = 0;
  @Input() lepen: number = 0;
  public chartOptions: Partial<ChartOptions>;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["macron"] || changes["lepen"]) {
      this.chartOptions = {
        series: [this.macron, this.lepen],
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
  constructor() {
    this.chartOptions = {
      series: [this.macron, this.lepen],
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
