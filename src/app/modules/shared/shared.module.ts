import { ChangeDetectorRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ProductLookupDialogComponent } from './product-lookup-dialog/product-lookup-dialog.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    ProductLookupDialogComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbCardModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbTreeGridModule,
  ],
  exports: [
    ConfirmationDialogComponent,
    ProductLookupDialogComponent
  ],
  providers: [
    ConfirmationDialogComponent,
    ProductLookupDialogComponent
  ]
})
export class SharedModule { }
