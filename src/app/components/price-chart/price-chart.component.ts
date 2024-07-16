import { Component, ViewChild, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTitleSubtitle, ApexStroke, ApexGrid, NgApexchartsModule } from "ng-apexcharts";
import { CommunePriceM2Service } from "../../services/communepricem2.service";
import { InseeCodeByCommuneNameService } from "../../services/insee-code-by-commune-name.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "app-price-chart",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./price-chart.component.html",
  styleUrls: ["./price-chart.component.scss"]
})
export class PriceChartComponent implements OnInit, OnChanges {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input() communeName!: string;

  constructor(
    private communePriceService: CommunePriceM2Service,
    private inseeCodeService: InseeCodeByCommuneNameService
  ) {
    this.chartOptions = {
      series: [
        {
          name: "Prix médian",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Évolution du prix médian par m²",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: []
      }
    };
  }

  ngOnInit(): void {
    if (this.communeName) {
      this.loadCommuneData(this.communeName);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["communeName"] && !changes["communeName"].firstChange) {
      this.loadCommuneData(changes["communeName"].currentValue);
    }
  }

  loadCommuneData(communeName: string): void {
    this.inseeCodeService.getCommuneInseeCode(communeName).subscribe(
      (response: string | any[]) => {
        if (response.length > 0) {
          const communeCode = response[0].code;
          console.log('Code INSEE pour la commune', communeName, ':', communeCode);
          this.loadPriceData(communeCode);
        } else {
          console.error('Commune not found');
        }
      });
  }

  loadPriceData(communeCode: string): void {
    this.communePriceService.getCommuneData(communeCode).subscribe((data: { results: any[] }) => {
      const last10Years = data.results
        .filter((result: any) => parseInt(result.annee) >= new Date().getFullYear() - 10)
        .sort((a: any, b: any) => parseInt(a.annee) - parseInt(b.annee));
      
      this.chartOptions.series = [{
        name: "Prix médian",
        data: last10Years.map((yearData: any) => Math.round(yearData.pxm2_median_cod111))
      }];
      
      this.chartOptions.xaxis = {
        categories: last10Years.map((yearData: any) => yearData.annee)
      };

      if (this.chart) {
        this.chart.updateOptions(this.chartOptions);
      }
    });
  }
}
