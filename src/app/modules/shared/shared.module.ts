import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ActiveProductDialogComponent } from './active-product-dialog/active-product-dialog.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule, NbTabsetModule, NbButtonGroupModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent
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
    NbButtonGroupModule
  ],
  exports: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent
  ],
  providers: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent
  ]
})
export class SharedModule { }
