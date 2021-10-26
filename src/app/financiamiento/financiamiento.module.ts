import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanciamientoRoutingModule } from './financiamiento-routing.module';
import { CalcularCuotaComponent } from './calcular-cuota/calcular-cuota.component';
import { SolicitarCreditoComponent } from './solicitar-credito/solicitar-credito.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import { MatInputModule } from '@angular/material';



export let options: Partial<IConfig> | (() => Partial<IConfig>);


@NgModule({
  declarations: [
    CalcularCuotaComponent, 
    SolicitarCreditoComponent
  ],
  imports: [
    CommonModule,
    FinanciamientoRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    NgxMaskModule,
    MatInputModule
  ]
})
export class FinanciamientoModule { }
