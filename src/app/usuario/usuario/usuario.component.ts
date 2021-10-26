import { Component, OnInit, Inject } from '@angular/core';
import { EncabezadoComponent } from 'src/app/components/encabezado.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  public loading = false;
  constructor(
    @Inject(EncabezadoComponent) public encabezado:EncabezadoComponent
  ){ }

  ngOnInit() {
    window.scrollTo(0,0);
  }

}
