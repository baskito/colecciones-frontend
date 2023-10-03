import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../guards/auth.guard';
import { UsersComponent } from './maintenance/users/users.component';
import { AccesoriosComponent } from './maintenance/accesorios/accesorios.component';
import { ConsoleComponent } from './maintenance/consoles/console.component';
import { CollectionsComponent } from './maintenance/collections/collections.component';
import { EditCollectionComponent } from './maintenance/collections/edit-collection/edit-collection.component';
import { ViewCollectionComponent } from './maintenance/collections/view-collection/view-collection.component';
import { ViewImageComponent } from './view-image/view-image.component';
import { EditAccesorioComponent } from './maintenance/accesorios/edit-accesorio/edit-accesorio.component';
import { ViewAccesorioComponent } from './maintenance/accesorios/view-accesorio/view-accesorio.component';
import { GameComponent } from './maintenance/games/game.component';
import { EditGameComponent } from './maintenance/games/edit-game/edit-game.component';
import { ViewGameComponent } from './maintenance/games/view-game/view-game.component';
import { EditConsoleComponent } from './maintenance/consoles/edit-console/edit-console.component';
import { ViewConsoleComponent } from './maintenance/consoles/view-console/view-console.component';


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
      { path: 'consoles', component: ConsoleComponent },
      { path: 'consoles/new', component: EditConsoleComponent },
      { path: 'consoles/edit/:id', component: EditConsoleComponent },
      { path: 'consoles/view/:id', component: ViewConsoleComponent },
      // Accesorios
      { path: 'accesorios', component: AccesoriosComponent },
      { path: 'accesorios/new', component: EditAccesorioComponent },
      { path: 'accesorios/edit/:id', component: EditAccesorioComponent },
      { path: 'accesorios/view/:id', component: ViewAccesorioComponent },
      // Juegos
      { path: 'games', component: GameComponent },
      { path: 'games/new', component: EditGameComponent },
      { path: 'games/edit/:id', component: EditGameComponent },
      { path: 'games/view/:id', component: ViewGameComponent },
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
