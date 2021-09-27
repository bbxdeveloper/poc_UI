import { Component, Input, OnInit } from '@angular/core';
import { NbDialogService, NbIconConfig } from '@nebular/theme';
import { Constants } from 'src/assets/util/Constants';
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
  invoicingMenuItems = [
    { title: 'Számla', link: "invoicing/invoice" }
  ];
  
  constructor(private dialogService: NbDialogService) { }

  ngOnInit(): void {
    this.isElectron = environment.electron;
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
