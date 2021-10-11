import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NbLayoutModule, NbButtonModule, NbCardModule, NbTreeGridModule, NbChatModule, NbChatOptions } from '@nebular/theme';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { HeaderModule } from './header/header.module';
import { ChatService } from 'src/app/services/chat.service';



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
    HeaderModule
  ],
  providers: [
    ChatService,
    NbChatOptions
  ]
})
export class CoreModule { }
