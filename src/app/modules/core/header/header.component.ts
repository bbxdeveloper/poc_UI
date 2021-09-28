import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NbDialogService, NbIconConfig } from '@nebular/theme';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
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
  
  constructor(
    private dialogService: NbDialogService,
    private kbS: KeyboardNavigationService) {
      this.kbS.selectCurrentTile();
    }

  ngOnInit(): void {
    this.isElectron = environment.electron;
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case KeyBindings.up: {
        this.kbS.moveUp(true, event.altKey);
        break;
      }
      case KeyBindings.down: {
        this.kbS.moveDown(true, event.altKey);
        break;
      }
      case KeyBindings.left: {
        this.kbS.moveLeft(true, event.altKey);
        break;
      }
      case KeyBindings.right: {
        this.kbS.moveRight(true, event.altKey);
        break;
      }
      default: {}
    }
  }

  quit(event: any): void {
    event.preventDefault();
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, { context: { msg: Constants.MSG_CONFIRMATION_QUIT } });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        window.close();
      }
    });
  }

}
