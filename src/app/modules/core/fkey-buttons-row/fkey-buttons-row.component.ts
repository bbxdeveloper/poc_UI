import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fkey-buttons-row',
  templateUrl: './fkey-buttons-row.component.html',
  styleUrls: ['./fkey-buttons-row.component.scss']
})
export class FKeyButtonsRowComponent implements OnInit {
  readonly commands = [
    { key: 'F1', value: 'Súgó', disabled: false },
    { key: 'F2', value: 'Keresés', disabled: false },
    { key: 'F3', value: 'Új Partner', disabled: false },
    { key: 'F4', value: 'Számolás', disabled: false },
    { key: 'F5', value: 'Adóalany', disabled: false },
    { key: 'F6', value: 'Módosítás', disabled: false },
    { key: 'F7', value: 'GdprNy', disabled: false },
    { key: 'F8', value: 'GdprAd', disabled: false },
    { key: 'F9', value: '', disabled: false },
    { key: 'F10', value: '', disabled: false },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
