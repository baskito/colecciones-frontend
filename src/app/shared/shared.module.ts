import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';



@NgModule({
  declarations: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
    PageHeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
    PageHeaderComponent,
    FooterComponent,
  ]
})
export class SharedModule { }
