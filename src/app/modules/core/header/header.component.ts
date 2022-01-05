import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbIconConfig } from '@nebular/theme';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { StatusService } from 'src/app/services/status.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Constants } from 'src/assets/util/Constants';
import { KeyBindings } from 'src/assets/util/KeyBindings';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import * as $ from 'jquery'
import { SumReportDateIntervalDialogComponent } from '../../shared/sum-report-date-interval-dialog/sum-report-date-interval-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() title: string = "";

  isElectron: boolean = false;
  
  settingsIconConfig: NbIconConfig = { icon: 'settings-2-outline', pack: 'eva' };
  subInvoicingMenuItems = [
    { title: 'Számla', link: "invoicing/invoice", target: "invoicing-sub-1" },
    { title: 'Számla nyomtatása', link: "", target: "invoicing-sub-2" }
  ];

  get InProgress(): boolean { return this.sts.InProgress; }
  
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
    private utS: UtilityService,
    private router: Router,
    private sts: StatusService) {

    }

  ngOnInit(): void {
    this.isElectron = environment.electron;
  }

  ngAfterViewInit(): void {
    this.generateAndSetNavMatrices();
    this.kbS.selectFirstTile();
  }

  private generateAndSetNavMatrices(): void {
    // Get menus
    const headerMenusRaw = $(".cl-header-menu");

    // Prepare matrix and submenu mappings
    const headerNavMatrix: string[][] = [[]];
    const subMapping: { [id: string]: string[][]; } = {};

    // Getting ids for menus
    for (let i = 0; i < headerMenusRaw.length; i++) {
      // Id of menu for navigation
      const nextId = headerMenusRaw[i].id;
      headerNavMatrix[0].push(nextId);

      // Get list of submenu ids from the data-sub attribute
      const subItems = headerMenusRaw[i].getAttribute('data-sub')?.split(',');
      if (!!subItems) {
        for (let o = 0; o < subItems.length; o++) {
          // Next submenu id to add
          const nextSubId = subItems[o];

          // If no available mapping for the menu, initialize it
          if (!(!!subMapping[nextId] && subMapping[nextId].length > 0)) {
            subMapping[nextId] = [];
          }

          // Adding submenu id to the mapping of the current menu
          subMapping[nextId].push([nextSubId]);
        }
      }
    }

    // Set nav matrices in KeyboardNavigationService
    this.kbS.setHeaderMatrices(headerNavMatrix, subMapping);
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
      return;
    }
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, { context: { msg: Constants.MSG_CONFIRMATION_QUIT } });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        window.close();
      }
    });
  }

  printReport(): void {
    this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintReportProcessPhases.PROC_CMD]);
    this.utS.execute(
      Constants.CommandType.POC_REPORT, Constants.FileExtensions.PDF,
      {
        "section": "SzallitoSzamla",
        "fileType": "pdf",
        "report_params": {
          "params": [
            {
              "key": "peldanyCount",
              "value": "1"
            },
            {
              "key": "storageName",
              "value": "001 | Központi Raktár"
            },
            {
              "key": "buyerName",
              "value": "ABC Zrt."
            },
            {
              "key": "addressZipCity",
              "value": "Szeged 5000"
            },
            {
              "key": "addressStreet",
              "value": "Etető út 5."
            },
            {
              "key": "taxNumber",
              "value": "5235234321"
            },
            {
              "key": "identifier",
              "value": "64234234"
            },
            {
              "key": "madeBy",
              "value": "Szilárd Simon"
            },
            {
              "key": "paymentMethod",
              "value": "Átutalás"
            },
            {
              "key": "finishDate",
              "value": "2021.12.10"
            },
            {
              "key": "dateStamp",
              "value": "2021.12.11"
            },
            {
              "key": "paymentDate",
              "value": "2021.12.20"
            },
            {
              "key": "documentNumber",
              "value": "C0-FS3G4G3-210C"
            }
          ]
        },
        "data_operation": Constants.DataOperation.PRINT_BLOB
      } as Constants.Dct);
  }

  printGradesReport(): void {
    const dialogRef = this.dialogService.open(SumReportDateIntervalDialogComponent, { context: {} });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        this.sts.pushProcessStatus(Constants.DownloadReportStatuses[Constants.DownloadReportProcessPhases.PROC_CMD]);
        this.utS.execute(Constants.CommandType.PRINT_POC_GRADES, Constants.FileExtensions.PDF,
          {
            "section": "OsszegFokozatos",
            "fileType": "pdf",
            "report_params": {
              "params": []
            },
            "data_operation": Constants.DataOperation.DOWNLOAD_BLOB
          } as Constants.Dct);
      }
    });
  }

}
