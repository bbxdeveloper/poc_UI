import { Component, HostListener, OnInit } from '@angular/core';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { KeyBindings } from 'src/assets/util/KeyBindings';

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

  constructor(
    private kbS: KeyboardNavigationService) {
    this.kbS.selectFirstTile();
  }

  ngOnInit(): void {
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      event.preventDefault();
    }
    switch (event.key) {
      case KeyBindings.F1: {
        if (!this.kbS.isEditModeActivated) {
          event.preventDefault();
          // TODO: open Help.
        }
        break;
      }
      case KeyBindings.F4: {
        if (!this.kbS.isEditModeActivated) {
          event.preventDefault();
          // TODO: open Help.
        }
        break;
      }
      default: { }
    }
  }

}
