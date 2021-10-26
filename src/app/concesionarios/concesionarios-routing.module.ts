import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConcesionariosComponent } from './concesionarios/concesionarios.component';


const routes: Routes = [
  {
    path:'',
    component: ConcesionariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConcesionariosRoutingModule { }
