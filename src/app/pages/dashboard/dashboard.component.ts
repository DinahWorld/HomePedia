import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { EducationService } from '../../services/education.service';
import { RestaurantService } from '../../services/restaurant.service';
import { ElectionsService } from '../../services/elections.service';
import { ElectionChartComponent } from '../../components/election-chart/election-chart.component';
import { TabComponent } from '../../components/tab/tab.component';
import { PriceChartComponent } from '../../components/price-chart/price-chart.component';
import { DataService } from '../../services/data.service';
import { Election } from '../../services/education.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  searchValue = '';
  countryData: any;
  restaurantData: any[] = [];
  educationData: any[] = [];
  macron: number = 10;
  lepen: number = 10;

  constructor(
    private educationService: EducationService,
    private restaurantService: RestaurantService,
    private electionsService: ElectionsService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const placeName = this.dataService.getData();
    if (placeName != null) {
      this.searchValue = placeName;
      this.searchCountry();
    }
  }

  searchCountry(): void {
    console.log('Searching for:', this.searchValue);

    this.educationService.searchSchoolsByLocation(this.searchValue).subscribe(
      data => {
        console.log('School received:', data);
        this.educationData = data.results;
      },
      error => {
        console.error('Error:', error);
      }
    );

    this.restaurantService.searchFoodServicesByLocation(this.searchValue).subscribe(
      data => {
        console.log('Restaurants received:', data);
        this.restaurantData = data.results;
      },
      error => {
        console.error('Error:', error);
      }
    );

    this.electionsService.searchElectionDataByCity(this.searchValue).subscribe(
      data => {
        console.log('Election received:', data);
        this.macron = data["MACRON"];
        this.lepen = data["LE PEN"];
        console.log(data["MACRON"])
        console.log(data["LE PEN"])

      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}

@NgModule({
  imports: [BrowserModule, FormsModule, ElectionChartComponent, PriceChartComponent, TabComponent],
  declarations: [DashboardComponent],
})
export class DummyModule {}
