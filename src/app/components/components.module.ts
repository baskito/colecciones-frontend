import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalImageComponent } from './modal-image/modal-image.component';
import { MissingChartComponent } from './missing-chart/missing-chart.component';
import { ModalConsoleComponent } from './modal-console/modal-console.component';
import { PipesModule } from "../pipes/pipes.module";



@NgModule({
    declarations: [
        ModalImageComponent,
        ModalConsoleComponent,
        MissingChartComponent
    ],
    exports: [
        ModalImageComponent,
        ModalConsoleComponent,
        MissingChartComponent
    ],
    imports: [
        CommonModule,
        PipesModule
    ]
})
export class ComponentsModule { }
