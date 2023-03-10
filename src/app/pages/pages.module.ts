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
import { EditCollectionComponent } from './maintenance/collections/edit-collection/edit-collection.component';
import { PipesModule } from '../pipes/pipes.module';
import { ViewCollectionComponent } from './maintenance/collections/view-collection/view-collection.component';
import { ViewImageComponent } from './view-image/view-image.component';
import { EditAccesorioComponent } from './maintenance/accesorios/edit-accesorio/edit-accesorio.component';
import { ViewAccesorioComponent } from './maintenance/accesorios/view-accesorio/view-collection.component';



@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    ProfileComponent,
    UsersComponent,
    CollectionsComponent,
    AccesoriosComponent,
    ConsolesComponent,
    EditCollectionComponent,
    ViewCollectionComponent,
    EditAccesorioComponent,
    ViewAccesorioComponent,
    ViewImageComponent
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
    ComponentsModule,
    PipesModule
  ]
})
export class PagesModule { }
