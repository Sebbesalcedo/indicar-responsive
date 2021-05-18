import { Component, OnInit, OnDestroy } from '@angular/core';
import { GoogleAnalyticsService } from './servicios/google/analytics/google-analytics.service';
/*
import { EncabezadoComponent  } from './componentes/encabezado.component';
import { NuevoComponent } from './componentes/nuevo.component';
import { NuevoDetalleComponent } from './componentes/nuevo-detalle.component';
import { UsadoComponent } from './componentes/usado.component';
import { ConcesionarioComponent } from './componentes/concesionario.component';
import { UsadoDetalleComponent } from './componentes/usado-detalle.component';
import { InicioComponent } from './componentes/inicio.component';
import { VitrinaComponent } from './componentes/vitrina.component';

import { ValoraComponent } from './componentes/valora.component';
import { MenuLateralUsuarioComponent } from './componentes/menu-lateral-usuario.component';
import { MiCuenta } from './componentes/mi-cuenta.component';
import { Configuracion } from './componentes/configuracion.component';
//import { PublicarComponent } from './componentes/publicar.component';
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // Creates an instance of AppComponent and inject a router service we'll use in the component.
  constructor(private googleAnalyticsService: GoogleAnalyticsService) {

  }

  ngOnInit() {
    // subscribe to the ga posts
    this.googleAnalyticsService.subscribe();
  }

  ngOnDestroy() {
    // unsubscribe to the post
    this.googleAnalyticsService.unsubscribe();
  }



  title = 'app';
  static paginasize=51;
  //static urlservicio="http://siisa_ec.processoft.com.co/sistema/indicar/servicios/serviceIndicar.php";
  //static urlservicio="http://new_indicar.processoft.com.co/server_indicar/servicios/serviceIndicar.php";
  // static urlservicio="https://www.indicar.com.co/server_indicar/servicios/serviceIndicar.php";
  // static urlservicio="http://localhost/server_indicar/servicios/serviceIndicar.php";

  // static urlservicio="http://local.indicar.com.co/servicios/serviceIndicar.php";

  static urlservicio="http://192.168.0.66/processoft/server_indicar/servicios/serviceIndicar.php";


  // static urlservicio="http://192.168.0.66/server_indicar/servicios/serviceIndicar.php";
  static tituloalertas="Indicar";
  static is_login=false;
  static mask_telefono = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] ;
}
