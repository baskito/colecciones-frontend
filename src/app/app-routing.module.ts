import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { AuthRoutingModule } from './auth/auth.routing';

import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { PagesComponent } from './pages/pages.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [

  // path: '/login' AuthRouting
  // path: '/signup' AuthRouting

  // path: '/home' PagesRouting
  // path: '/dashboard' PagesRouting
  // path: '/profile' PagesRouting
  { path: '', redirectTo: '/dashboard/home', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent },

];

@NgModule({
  imports: [
    RouterModule.forRoot( routes ),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
