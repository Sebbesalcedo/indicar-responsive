import { Component } from '@angular/core';
import { UsadoFiltroComponent } from './usado-filtro.component';

@Component({
  selector: 'app-usado-filtro-responsive',
  templateUrl: '../templates/usado.filtro.responsive.template.html',
  styleUrls: ['../css/filtros.css']
})
export class UsadoFiltroResponsiveComponent extends UsadoFiltroComponent {
  filmar=false;
  filfam=false;
}