import { Component, OnInit, Inject } from '@angular/core';
import { EncabezadoComponent } from 'src/app/components/encabezado.component';

@Component({
  selector: 'app-usuario-filtros',
  templateUrl: './usuario-filtros.component.html',
  styleUrls: ['./usuario-filtros.component.css']
})
export class UsuarioFiltrosComponent implements OnInit {
  // VARIABLES
  expandedPanel:boolean = false;
  cuser:any   = null;
  constructor(
    @Inject(EncabezadoComponent) public encabezado:EncabezadoComponent
  ){ }

  ngOnInit(){
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
  }

}
