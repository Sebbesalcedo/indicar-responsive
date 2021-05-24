import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiasDetalleComponent } from './noticias-detalle/noticias-detalle.component';


const routes: Routes = [
  {
    path: '',
    component: NoticiasComponent
  },
  {
    path: ':id',
    component: NoticiasDetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiasRoutingModule { }
