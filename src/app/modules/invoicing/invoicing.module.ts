import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceNavComponent } from './invoice-nav/invoice-nav.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule, NbInputModule, NbFormFieldModule, NbThemeModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InvoiceNavComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbLayoutModule,
    NbButtonModule,
    NbCardModule,
    NbTreeGridModule,
    NbFormFieldModule,
    NbInputModule,
  ],
  exports: [
  ]
})
export class InvoicingModule { }
