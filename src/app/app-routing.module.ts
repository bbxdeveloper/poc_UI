import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/core/dashboard/dashboard.component';
import { InvoiceNavComponent } from './modules/invoicing/invoice-nav/invoice-nav.component';

const routes: Routes = [
  {
    path: 'invoicing',
    children: [
      {
        path: "invoice",
        component: InvoiceNavComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    component: DashboardComponent
  },
  // otherwise redirect to stations
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
