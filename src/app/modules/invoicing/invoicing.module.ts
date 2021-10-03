import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceNavComponent } from './invoice-nav/invoice-nav.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule, NbInputModule, NbFormFieldModule, NbThemeModule, NbAutocompleteModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'



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
    NgxMaskModule.forChild(),
    NbAutocompleteModule
  ],
  exports: [
  ]
})
export class InvoicingModule { }
