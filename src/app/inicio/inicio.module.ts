import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioRoutingModule } from './inicio-routing.module';
// dependencias y librerias
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// componentes
import { InicioComponent } from './inicio/inicio.component';
import { InicioFiltroComponent } from './inicio-filtro/inicio-filtro.component';
import { InicioGangasComponent } from './inicio-gangas/inicio-gangas.component';
import { InicioUnicoDuenioComponent } from './inicio-unico-duenio/inicio-unico-duenio.component';


@NgModule({
  declarations: [
    InicioComponent,
    InicioFiltroComponent,
    InicioGangasComponent,
    InicioUnicoDuenioComponent
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class InicioModule { }
