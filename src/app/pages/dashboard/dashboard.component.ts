import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { EducationService } from '../../services/education.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  searchValue = '';
  department = 94;
  countryData: any;

  constructor(private educationService: EducationService) {}

  searchCountry(): void {
    console.log('Searching for:', this.searchValue);
    this.educationService.searchSchoolsByLocation(this.searchValue).subscribe(
      data => {
        this.countryData = data;
        console.log('Data received:', this.countryData);
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
