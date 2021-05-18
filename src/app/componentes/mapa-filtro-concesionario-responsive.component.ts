import { Component } from '@angular/core';
import { MapaConcesionarioFiltroComponent } from './mapa.filtro.concesionario.component';

@Component({
  selector: 'app-mapa-filtro-concesionario-responsive',
  templateUrl: '../templates/mapa.filtro.concesionario.responsive.template.html',
  styleUrls: ['../css/filtros.css']
})
export class MapaFiltroConcesionarioResponsiveComponent extends MapaConcesionarioFiltroComponent {
  filmar=false;
  filfam=false;
}