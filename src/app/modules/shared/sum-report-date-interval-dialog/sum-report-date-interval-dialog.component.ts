import { AfterContentInit, AfterViewChecked, Component, HostListener, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FooterService } from 'src/app/services/footer.service';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { KeyBindings } from 'src/assets/util/KeyBindings';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const NavMap: string[][] = [
  ["sum-report-date-dialog-from"],
  ["sum-report-date-dialog-to"],
  ["sum-report-date-dialog-button-yes", "sum-report-date-dialog-button-no"]
];

@Component({
  selector: 'app-sum-report-date-interval-dialog',
  templateUrl: './sum-report-date-interval-dialog.component.html',
  styleUrls: ['./sum-report-date-interval-dialog.component.scss']
})
export class SumReportDateIntervalDialogComponent implements AfterContentInit, AfterViewChecked, OnDestroy {
  dateForm: FormGroup;
  
  closedManually = false;

  get isEditModeOff() {
    return this.kbS.currentKeyboardMode !== KeyboardModes.EDIT;
  }

  constructor(
    private fS: FooterService,
    protected dialogRef: NbDialogRef<SumReportDateIntervalDialogComponent>,
    private kbS: KeyboardNavigationService
  ) {
    this.fS.pushEmptyList();
    this.dateForm = new FormGroup({
      dateFrom: new FormControl('', [Validators.required]),
      dateTo: new FormControl('', [Validators.required])
    });
  }

  ngAfterContentInit(): void {
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
    this.kbS.attachNewMap(NavMap, true, true, true);
  }
  ngAfterViewChecked(): void {
    this.kbS.selectCurrentTile();
  }
  ngOnDestroy(): void {
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
    if (!this.closedManually) {
      this.kbS.detachLastMap(1, true);
      this.kbS.unlockDirections();
    }
  }

  close(answer: boolean): any {
    this.closedManually = true;
    this.kbS.detachLastMap(1, true);
    this.kbS.unlockDirections();
    this.dialogRef.close(
      answer ? { From: this.dateForm.get('dateFrom')?.value, To: this.dateForm.get('dateTo')?.value } : undefined
    );
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      event.preventDefault();
    }
    switch (event.key) {
      case KeyBindings.exit: {
        event.preventDefault();
        // Closing dialog
        this.close(false);
        break;
      }
      default: { }
    }
  }

  handleFormEnter(event: Event, jumpNext: boolean = true, toggleEditMode: boolean = true): void {
    console.log("FORM HANDLING KEYBOARD ACTION");
    if (toggleEditMode) {
      this.kbS.toggleEdit();
    }
    if (jumpNext) {
      let oldMy = this.kbS.matrixPos.Y;
      this.kbS.moveNextInForm();
      // TODO: navigációs mátrixhoz típust rendelni, pl. "táblázat"
      if (oldMy < this.kbS.matrixPos.Y) {
        console.log(this.kbS.getCurrentTile());
        this.kbS.setEditMode(KeyboardModes.NAVIGATION);
        // this.gridNavHandler.handleGridEnter(this.productsData[0], 0, this.colDefs[0].objectKey, 0);
      } else {
        this.kbS.clickCurrentTile();
        if (this.isEditModeOff) {
          this.kbS.toggleEdit();
        }
      }
    }
  }
}
