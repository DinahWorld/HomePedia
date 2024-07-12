import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionChartComponent } from './election-chart.component';

describe('ElectionChartComponent', () => {
  let component: ElectionChartComponent;
  let fixture: ComponentFixture<ElectionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
