import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material.module';
import { PagesModule } from './pages/pages.module';

import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { PagesComponent } from './pages/pages.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
    PagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    PagesModule,
    SharedModule,
    AuthModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
