import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// MODULOS
import { InicioModule } from './inicio/inicio.module';
import { UsadosModule } from './usados/usados.module';
import { UsuarioModule} from './usuario/usuario.module';
import { ComparadorModule} from './comparador/comparador.module';
import { QuienesSomosComponent} from './paginas/quienes-somos/quienes-somos.component';
import { AvisoPrivacidadComponent } from './paginas/aviso-privacidad/aviso-privacidad.component';
import { PoliticasPublicacionComponent } from './paginas/politicas-publicacion/politicas-publicacion.component';
import { PoliticasTratamientoComponent } from './paginas/politicas-tratamiento/politicas-tratamiento.component';
import { PqrsComponent } from './paginas/pqrs/pqrs.component';
import {IntegradorComponent } from './integrador/integrador.component';
import {LoginDialog } from '../app/dialogs/login/login.dialog.component';

import {WompiFormsComponent} from './wompi-forms/wompi-forms.component';
import {ResumenPagoComponent} from './wompi-forms/resumen-pago/resumen-pago.component';
import {ValoradorComponent} from './valorador/valorador.component';

const routes: Routes = [


  {

    path: 'ValoraTuVehiculo',
    component:ValoradorComponent,

    data: {preload:true}

  },

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  // { path: '**',
  //   redirectTo: 'inicio'
  // },
  {
    path: 'inicio',
    loadChildren: './inicio/inicio.module#InicioModule',
    data: {preload:true}
  },
  {
    path: 'login',
    component: LoginDialog,
    data: {preload:true}
  },
  {
    path: 'usados',
    loadChildren: './usados/usados.module#UsadosModule',
    data: {preload:true}
  },
  {
    path: 'usuario',
    loadChildren: './usuario/usuario.module#UsuarioModule',
    data: {preload:true}
  },
  {
    path: 'financiamiento',
    loadChildren: './financiamiento/financiamiento.module#FinanciamientoModule',
    data: {preload:true}
  },
  {
    path: 'concesionarios',
    loadChildren: './concesionarios/concesionarios.module#ConcesionariosModule',
    data: {preload:true}
  },
  {
    path: 'comparador',
    loadChildren: './comparador/comparador.module#ComparadorModule'
  },
  {
    path: 'recomendador',
    loadChildren: './recomendador/recomendador.module#RecomendadorModule'
  },
  {
    path: 'quienes-somos',
    component: QuienesSomosComponent
  },
  {
    path: 'aviso-privacidad',
    component: AvisoPrivacidadComponent
  },
  {
    path: 'politicas-tratamiento-datos',
    component: PoliticasTratamientoComponent
  },
  {
    path: 'politicas-publicacion',
    component: PoliticasPublicacionComponent
  },
  {
    path: 'pqrs',
    component: PqrsComponent
  },
  {
    path: 'noticias',
    loadChildren: './noticias/noticias.module#NoticiasModule'
  },
  {

    path: 'authorization', component: IntegradorComponent

  },{

    path: 'pagos/:id',
    component:WompiFormsComponent

  },
  {

    path: 'resumen_pago',
    component:ResumenPagoComponent

  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    InicioModule,
    UsadosModule,
    UsuarioModule,
    RouterModule.forRoot(routes,{
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
