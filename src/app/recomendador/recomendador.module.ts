import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { RecomendadorRoutingModule } from './recomendador-routing.module';
import { RecomendadorComponent } from './recomendador/recomendador.component';


@NgModule({
  declarations: [
    RecomendadorComponent
  ],
  imports: [
    CommonModule,
    RecomendadorRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class RecomendadorModule{ }
