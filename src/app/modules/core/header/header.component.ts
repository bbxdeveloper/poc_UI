import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconConfig } from '@nebular/theme';
import { windowsStore } from 'process';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { Constants } from 'src/assets/util/Constants';
import { KeyBindings } from 'src/assets/util/KeyBindings';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() title: string = "";

  isElectron: boolean = false;

  settingsIconConfig: NbIconConfig = { icon: 'settings-2-outline', pack: 'eva' };
  subInvoicingMenuItems = [
    { title: 'Számla', link: "invoicing/invoice", target: "invoicing-sub-1" }
  ];

  get keyboardMode(): string {
    var mode = this.kbS.currentKeyboardMode;
    switch(mode) {
      case KeyboardModes.NAVIGATION:
        return "Mód: Navigáció";
        break;
      case KeyboardModes.EDIT:
        return "Mód: Szerkesztés";
        break;
      default:
        return "Mód: Ismeretlen";
        break;
    }
  }

  get keyboardModeStatus(): string {
    var mode = this.kbS.currentKeyboardMode;
    switch (mode) {
      case KeyboardModes.NAVIGATION:
        return "primary";
        break;
      case KeyboardModes.EDIT:
        return "warning";
        break;
      default:
        return "danger";
        break;
    }
  }
  
  constructor(
    private dialogService: NbDialogService,
    private kbS: KeyboardNavigationService,
    private router: Router) {
      this.kbS.selectFirstTile();
    }

  ngOnInit(): void {
    this.isElectron = environment.electron;
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      event.preventDefault();
    }
    switch (event.key) {
      case KeyBindings.up: {
        if (!this.kbS.isEditModeActivated) {
          event.preventDefault();
          this.kbS.moveUp(true, event.altKey);
        }
        break;
      }
      case KeyBindings.down: {
        if (!this.kbS.isEditModeActivated) {
          event.preventDefault();
          this.kbS.moveDown(true, event.altKey);
        }
        break;
      }
      case KeyBindings.left: {
        if (!this.kbS.isEditModeActivated) {
          event.preventDefault();
          this.kbS.moveLeft(true, event.altKey);
        }
        break;
      }
      case KeyBindings.right: {
        if (!this.kbS.isEditModeActivated) {
          event.preventDefault();
          this.kbS.moveRight(true, event.altKey);
        }
        break;
      }
      case KeyBindings.edit: {
        console.log("HEADER HANDLING KEYBOARD ACTION");
        if (!this.kbS.isEditModeActivated) {
          event.preventDefault();
        }
        this.kbS.clickCurrentTile();
        break;
      }
      default: {}
    }
  }

  handleEscape(): void {
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
  }

  goTo(link: string): void {
    this.router.navigate([link]/*, { relativeTo: this.route }*/);
  }

  quit(event: any): void {
    event.preventDefault();
    if (!this.isElectron) {
      //return;
    }
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, { context: { msg: Constants.MSG_CONFIRMATION_QUIT } });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        window.close();
      }
    });
  }

}
