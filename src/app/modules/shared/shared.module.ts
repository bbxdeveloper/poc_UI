import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NbButtonModule, NbCardModule, NbLayoutModule } from '@nebular/theme';



@NgModule({
  declarations: [
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbCardModule,
    NbButtonModule
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  providers: [
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }
