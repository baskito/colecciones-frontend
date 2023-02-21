import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    UserComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    HomeComponent,
    DashboardComponent,
    UserComponent,
  ]
})
export class PagesModule { }
