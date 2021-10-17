import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule, NbChatModule, NbChatOptions } from '@nebular/theme';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { HeaderModule } from './header/header.module';
import { ChatService } from 'src/app/services/chat.service';
import { FkeyButtonsRowModule } from './fkey-buttons-row/fkey-buttons-row.module';



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
    NbChatModule
  ],
  exports: [
    HeaderModule,
    FkeyButtonsRowModule
  ],
  providers: [
    ChatService,
    NbChatOptions
  ]
})
export class CoreModule { }
