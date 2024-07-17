import { AfterViewInit, Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements AfterViewInit, OnChanges {
  @Input() data: any[] = [];

  displayedColumns: string[] = ['position', 'name'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource.data = this.transformData(changes['data'].currentValue);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  transformData(data: any[]): any[] {
    return data.map((item, index) => ({
      position: index + 1,
      name: this.getName(item),
    }));
  }

  getName(element: any): string {
    return element.name || element.appellation_officielle || 'Unknown';
  }
}
