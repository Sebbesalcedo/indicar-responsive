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

import { AdsenseModule } from 'ng2-adsense';
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
    MatProgressSpinnerModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-7159056057507747',
      adSlot: 6534226710,
    }),
  ]
})
export class InicioModule { }
