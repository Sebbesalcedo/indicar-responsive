import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// DEPENDENCIAS
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatNativeDateModule } from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';


import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioCuentaComponent } from './usuario-cuenta/usuario-cuenta.component';
import { UsuarioFiltrosComponent } from './usuario-filtros/usuario-filtros.component';
import { UsuarioClasificadoComponent } from './usuario-clasificado/usuario-clasificado.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioFavoritoComponent } from './usuario-favorito/usuario-favorito.component';
import { UsuarioConversacionesComponent } from './usuario-conversaciones/usuario-conversaciones.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    UsuarioCuentaComponent,
    UsuarioFiltrosComponent,
    UsuarioClasificadoComponent,
    UsuarioComponent,
    UsuarioFavoritoComponent,
    UsuarioConversacionesComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    NgxMaskModule,
    MatAutocompleteModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSortModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  providers:[
  ]
})
export class UsuarioModule { }
