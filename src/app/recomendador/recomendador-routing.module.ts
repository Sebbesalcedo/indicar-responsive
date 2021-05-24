import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecomendadorComponent } from './recomendador/recomendador.component';


const routes: Routes = [
  {
    path: "",
    component: RecomendadorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecomendadorRoutingModule { }
