import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConcesionariosRoutingModule } from './concesionarios-routing.module';
import { ConcesionariosComponent } from './concesionarios/concesionarios.component';
import { ConcesionariosFiltroComponent } from './concesionarios/concesionarios-filtro/concesionarios-filtro.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UtilModule } from '../util/util.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ConcesionariosComponent, ConcesionariosFiltroComponent],
  imports: [
    CommonModule,
    ConcesionariosRoutingModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    UtilModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ConcesionariosModule { }
