import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardPublicarService } from './../servicios/auth-guard-publicar.service';

// COMPONENTES
import { UsadosPublicarComponent } from './usados-publicar/usados-publicar.component';
import { UsadosClasificadosComponent } from './usados-clasificados/usados-clasificados.component';
import { UsadoDetalleComponent } from './usado-detalle/usado-detalle.component';
import { LoginDialog } from '../dialogs/login/login.dialog.component';



const routes: Routes = [
  {
    path:'publicar',
    component: UsadosPublicarComponent,
    canActivate: [AuthGuardPublicarService]
  },
  {
    path:'publicar/:id',
    component: UsadosPublicarComponent,
    canActivate: [AuthGuardPublicarService]
  },
  {
    path:'clasificados',
    component: UsadosClasificadosComponent,
  },{
    path:'clasificado/detalle/:id',
    component: UsadoDetalleComponent,
  },{
    path:'logindialog',
    component: LoginDialog ,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsadosRoutingModule { }
