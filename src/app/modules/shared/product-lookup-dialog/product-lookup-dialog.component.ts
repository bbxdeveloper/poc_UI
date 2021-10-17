import { AfterContentInit, Component, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from 'out/bbx-win32-x64/resources/app/node_modules/@nebular/theme';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';

@Component({
  selector: 'app-product-lookup-dialog',
  templateUrl: './product-lookup-dialog.component.html',
  styleUrls: ['./product-lookup-dialog.component.scss']
})
export class ProductLookupDialogComponent implements AfterContentInit, OnDestroy {
  @Input() msg: string = "";
  closedManually = false;

  constructor(
    protected dialogRef: NbDialogRef<ProductLookupDialogComponent>,
    private kBs: KeyboardNavigationService
  ) { }

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
