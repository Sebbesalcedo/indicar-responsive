import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClasificadosComponent } from '../comparador/clasificados/clasificados.component';


const routes: Routes = [
  {
    path: '',
    component: ClasificadosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComparadorRoutingModule { }
