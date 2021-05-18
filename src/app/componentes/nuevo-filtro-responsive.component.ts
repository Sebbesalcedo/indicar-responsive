import { Component } from '@angular/core';
import { NuevoFiltroComponent } from './nuevo-filtro.component';

@Component({
  selector: 'app-nuevo-filtro-responsive',
  templateUrl: '../templates/nuevo.filtro.responsive.template.html',
  styleUrls: ['../css/filtros.css']
})
export class NuevoFiltroResponsiveComponent extends NuevoFiltroComponent {
	filmar=false;
  filfam=false;
}