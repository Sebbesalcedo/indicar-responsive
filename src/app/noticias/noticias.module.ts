import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticiasRoutingModule } from './noticias-routing.module';
import { NoticiasComponent } from './noticias/noticias.component';

// DEPENDENCIAS
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NoticiasDetalleComponent } from './noticias-detalle/noticias-detalle.component';
import { BoldPaginatorComponent } from '../util/bold-paginator/bold-paginator.component';
import { UtilModule } from '../util/util.module';


@NgModule({
  declarations: [
    NoticiasComponent,
    NoticiasDetalleComponent
  ],
  imports: [
    CommonModule,
    NoticiasRoutingModule,
    MatProgressSpinnerModule,
    UtilModule
  ]
})
export class NoticiasModule {}
