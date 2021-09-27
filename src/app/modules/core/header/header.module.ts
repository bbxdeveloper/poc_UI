import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { NbContextMenuModule, NbActionsModule, NbLayoutModule, NbMenuService, NbPopoverModule, NbCardModule, NbMenuModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbContextMenuModule,
    NbActionsModule,
    NbEvaIconsModule,
    NbPopoverModule,
    NbCardModule,
    NbMenuModule
  ],
  exports: [
    HeaderComponent
  ],
  providers: [
    NbMenuService
  ]
})
export class HeaderModule { }
