import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ActiveProductDialogComponent } from './active-product-dialog/active-product-dialog.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule, NbTabsetModule, NbButtonGroupModule, NbProgressBarModule, NbSpinnerModule, NbDatepickerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusAndSpinnerComponent } from './status-and-spinner/status-and-spinner.component';
import { SumReportDateIntervalDialogComponent } from './sum-report-date-interval-dialog/sum-report-date-interval-dialog.component';



@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent,
    StatusAndSpinnerComponent,
    SumReportDateIntervalDialogComponent
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
    NbSpinnerModule,
    NbDatepickerModule
  ],
  exports: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent,
    StatusAndSpinnerComponent,
    SumReportDateIntervalDialogComponent
  ],
  providers: [
    ConfirmationDialogComponent,
    ActiveProductDialogComponent,
    SumReportDateIntervalDialogComponent
  ]
})
export class SharedModule { }
