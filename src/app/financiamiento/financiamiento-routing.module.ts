import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalcularCuotaComponent } from './calcular-cuota/calcular-cuota.component';
import { SolicitarCreditoComponent } from './solicitar-credito/solicitar-credito.component';


const routes: Routes = [
  {
    path:'calcular-cuota',
    component: CalcularCuotaComponent
  },

  {
    path:'solicitar-credito',
    component: SolicitarCreditoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanciamientoRoutingModule { }
