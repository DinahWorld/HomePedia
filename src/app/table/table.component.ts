import { Component } from '@angular/core';

export interface PeriodicElement {
  city: string;
  position: number;
  m2_price: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, city: 'Paris', m2_price: 1231, symbol: 'H' },
  { position: 2, city: 'Antony', m2_price: 1231, symbol: 'He' },
  { position: 3, city: 'Sucy-en-Brie', m2_price: 1231, symbol: 'Li' },
  { position: 4, city: 'Le Perreux', m2_price: 1231, symbol: 'Be' },
  { position: 5, city: 'Le Blanc Mesnil', m2_price: 1231, symbol: 'B' },
  { position: 6, city: 'Villecresnes', m2_price: 1231, symbol: 'C' },
  { position: 7, city: 'Massy', m2_price: 1231, symbol: 'N' },
  { position: 8, city: 'Argenteuil', m2_price: 1231, symbol: 'O' },
  { position: 9, city: 'Kremlin-Bicêtre', m2_price: 1231, symbol: 'F' },
  { position: 10, city: 'Bonneuil-sur-Marne', m2_price: 1231, symbol: 'Ne' },
];

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
