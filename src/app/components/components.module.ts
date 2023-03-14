import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalImageComponent } from './modal-image/modal-image.component';
import { MissingChartComponent } from './missing-chart/missing-chart.component';



@NgModule({
  declarations: [
    ModalImageComponent,
    MissingChartComponent
  ],
  exports: [
    ModalImageComponent,
    MissingChartComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
