import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { EducationService } from '../../services/education.service';
import { RestaurantService } from '../../services/restaurant.service';
import { ElectionsService } from '../../services/elections.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  searchValue = '';
  department = 94;
  countryData: any;

  constructor(
    private educationService: EducationService,
    private restaurantService: RestaurantService,
    private electionsService: ElectionsService
  ) {}

  searchCountry(): void {
    console.log('Searching for:', this.searchValue);

    this.educationService.searchSchoolsByLocation(this.searchValue).subscribe(
      data => {
        console.log('School received:', data);
      },
      error => {
        console.error('Error:', error);
      }
    );

    this.restaurantService.searchFoodServicesByLocation(this.searchValue).subscribe(
      data => {
        console.log('Restaurants received:', data);
      },
      error => {
        console.error('Error:', error);
      }
    );

    this.electionsService.searchElectionDataByCity(this.searchValue).subscribe(
      data => {
        console.log('Election received:', data);
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [DashboardComponent],
})
export class DummyModule {}
