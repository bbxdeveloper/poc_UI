import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NbButtonModule, NbCardModule, NbLayoutModule } from '@nebular/theme';
import { ProductLookupDialogComponent } from './product-lookup-dialog/product-lookup-dialog.component';



@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    ProductLookupDialogComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbCardModule,
    NbButtonModule
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
