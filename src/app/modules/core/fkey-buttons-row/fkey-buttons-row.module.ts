import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbActionsModule, NbLayoutModule, NbMenuService, NbButtonModule, NbTagModule } from '@nebular/theme';
import { FKeyButtonsRowComponent } from './fkey-buttons-row.component';



@NgModule({
  declarations: [
    FKeyButtonsRowComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbActionsModule,
    NbButtonModule,
    NbTagModule
  ],
  exports: [
    FKeyButtonsRowComponent
  ],
  providers: [
    NbMenuService
  ]
})
export class FkeyButtonsRowModule { }
