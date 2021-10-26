import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { ComparadorRoutingModule } from './comparador-routing.module';
import { ClasificadosComponent } from './clasificados/clasificados.component';


@NgModule({
  declarations: [ClasificadosComponent],
  imports: [
    CommonModule,
    ComparadorRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class ComparadorModule { }
