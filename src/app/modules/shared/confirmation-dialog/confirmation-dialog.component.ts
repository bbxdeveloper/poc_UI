import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <nb-card>
    <nb-card-header>{{msg}}</nb-card-header>
    <nb-card-footer>
        <button nbButton (click)="close(true)" status="primary" tabindex="1">Yes</button>
        <button nbButton (click)="close(false)" status="danger" tabindex="2">No</button>
    </nb-card-footer>
  </nb-card>
  `,
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  @Input() msg: string = "";

  constructor(protected dialogRef: NbDialogRef<ConfirmationDialogComponent>) { }

  close(answer: boolean) {
    this.dialogRef.close(answer);
  }
}
