import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule } from '@nebular/theme';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { HeaderModule } from './header/header.module';



@NgModule({
  declarations: [
    DashboardComponent,
    StatCardComponent
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbButtonModule,
    NbCardModule,
    NbTreeGridModule,
  ],
  exports: [
    HeaderModule
  ]
})
export class CoreModule { }
