import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ActiveProductDialogComponent } from './active-product-dialog/active-product-dialog.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule, NbTabsetModule, NbButtonGroupModule, NbProgressBarModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusAndSpinnerComponent } from './status-and-spinner/status-and-spinner.component';



@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent,
    StatusAndSpinnerComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbCardModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbTreeGridModule,
    NbTabsetModule,
    NbButtonGroupModule,
    NbProgressBarModule,
    NbSpinnerModule
  ],
  exports: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent,
    StatusAndSpinnerComponent
  ],
  providers: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent
  ]
})
export class SharedModule { }
