import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'user', component: UserComponent },
    ],
  },

  //{ path: 'path/:routeParam', component: MyComponent },
  //{ path: 'staticPath', component: ... },
  //{ path: '**', component: ... },
  //{ path: 'oldPath', redirectTo: '/staticPath' },
  //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
