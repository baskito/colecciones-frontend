import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../guards/auth.guard';
import { UsersComponent } from './maintenance/users/users.component';
import { AccesoriosComponent } from './maintenance/accesorios/accesorios.component';
import { ConsolesComponent } from './maintenance/consoles/consoles.component';
import { CollectionsComponent } from './maintenance/collections/collections.component';
import { EditCollectionComponent } from './maintenance/collections/edit-collection/edit-collection.component';
import { ViewCollectionComponent } from './maintenance/collections/view-collection/view-collection.component';
import { ViewImageComponent } from './view-image/view-image.component';
import { EditAccesorioComponent } from './maintenance/accesorios/edit-accesorio/edit-accesorio.component';
import { ViewAccesorioComponent } from './maintenance/accesorios/view-accesorio/view-collection.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      // { path: 'consoles', component: ProfileComponent },
      // { path: 'collections', component: ProfileComponent },
      // { path: 'accesorios', component: ProfileComponent },
      { path: '', redirectTo: 'home' , pathMatch: 'full'},


      // Maintenance
      // Users
      { path: 'users', component: UsersComponent },
      // Consoles
      { path: 'consoles', component: ConsolesComponent },
      // Accesorios
      { path: 'accesorios', component: AccesoriosComponent },
      { path: 'accesorios/new', component: EditAccesorioComponent },
      { path: 'accesorios/edit/:id', component: EditAccesorioComponent },
      { path: 'accesorios/view/:id', component: ViewAccesorioComponent },
      // Collections
      { path: 'collections', component: CollectionsComponent },
      { path: 'collections/new', component: EditCollectionComponent },
      { path: 'collections/edit/:id', component: EditCollectionComponent },
      { path: 'collections/view/:id', component: ViewCollectionComponent },
      //View image
      { path: ':type/view/image/:id/:num', component: ViewImageComponent }

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
