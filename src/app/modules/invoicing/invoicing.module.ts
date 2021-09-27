import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceNavComponent } from './invoice-nav/invoice-nav.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InvoiceNavComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbButtonModule,
    NbCardModule,
    NbTreeGridModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class InvoicingModule { }
