import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// guards
import { AuthGuardPublicarService } from '../servicios/auth-guard-publicar.service';
// componentes
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioCuentaComponent } from './usuario-cuenta/usuario-cuenta.component';
import { UsuarioClasificadoComponent } from './usuario-clasificado/usuario-clasificado.component';
import { UsuarioFavoritoComponent } from './usuario-favorito/usuario-favorito.component';
import { UsuarioConversacionesComponent } from './usuario-conversaciones/usuario-conversaciones.component';


const routes: Routes = [
  {
    path:'usuario',
    component:UsuarioComponent,
    canActivate: [AuthGuardPublicarService], 
    children: [
      {
        path: 'cuenta',
        component: UsuarioCuentaComponent,
        outlet: 'cuenta-opcion'
      },
      {
        path: 'clasificado/:estado',
        component: UsuarioClasificadoComponent,
        outlet: 'cuenta-opcion'
      },
      {
        path: 'clasificado',
        component: UsuarioClasificadoComponent,
        outlet: 'cuenta-opcion'
      },
      {
        path: 'favoritos',
        component: UsuarioFavoritoComponent,
        outlet: 'cuenta-opcion'
      },
      {
        path: 'conversaciones',
        component: UsuarioConversacionesComponent,
        outlet: 'cuenta-opcion'
      },
      {
        path: 'conversaciones/:id',
        component: UsuarioConversacionesComponent,
        outlet: 'cuenta-opcion'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
