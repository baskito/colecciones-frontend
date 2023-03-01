import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages.component';
import { UsersComponent } from './maintenance/users/users.component';
import { MaterialModule } from '../shared/material.module';
import { ComponentsModule } from '../components/components.module';
import { AccesoriosComponent } from './maintenance/accesorios/accesorios.component';
import { CollectionsComponent } from './maintenance/collections/collections.component';
import { ConsolesComponent } from './maintenance/consoles/consoles.component';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    ProfileComponent,
    UsersComponent,
    CollectionsComponent,
    AccesoriosComponent,
    ConsolesComponent
  ],
  exports: [
    HomeComponent,
    ProfileComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    ComponentsModule
  ]
})
export class PagesModule { }
