import { AfterContentInit, AfterViewChecked, Component, HostListener, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FooterService } from 'src/app/services/footer.service';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { KeyBindings } from 'src/assets/util/KeyBindings';

const NavMap: string[][] = [
  ["sum-report-date-dialog-from", "sum-report-date-dialog-to"],
  ["sum-report-date-dialog-button-yes", "sum-report-date-dialog-button-no"]
];

@Component({
  selector: 'app-sum-report-date-interval-dialog',
  templateUrl: './sum-report-date-interval-dialog.component.html',
  styleUrls: ['./sum-report-date-interval-dialog.component.scss']
})
export class SumReportDateIntervalDialogComponent implements AfterContentInit, AfterViewChecked, OnDestroy {
  dateFrom = new Date();
  dateTo = new Date();
  
  closedManually = false;

  constructor(
    private fS: FooterService,
    protected dialogRef: NbDialogRef<SumReportDateIntervalDialogComponent>,
    private kbS: KeyboardNavigationService
  ) {
    this.fS.pushEmptyList();
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
      answer ? { From: this.dateFrom, To: this.dateTo } : undefined
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
}
