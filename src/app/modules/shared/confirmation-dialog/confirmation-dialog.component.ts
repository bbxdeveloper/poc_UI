import { AfterContentInit, Component, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements AfterContentInit, OnDestroy {
  @Input() msg: string = "";
  closedManually = false;

  constructor(
    protected dialogRef: NbDialogRef<ConfirmationDialogComponent>,
    private kBs: KeyboardNavigationService
  ) {}

  ngAfterContentInit(): void {
    this.kBs.attachNewMap([["confirm-dialog-button-yes", "confirm-dialog-button-no"]], true);
    this.kBs.lockDirections(true, false, true, false);
  }

  ngOnDestroy(): void {
    if (!this.closedManually) {
      this.kBs.detachLastMap(1, true);
      this.kBs.lockDirections();
    }
  }

  close(answer: boolean) {
    this.closedManually = true;
    this.kBs.detachLastMap(1, true);
    this.kBs.lockDirections();
    this.dialogRef.close(answer);
  }
}
