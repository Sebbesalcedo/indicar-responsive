import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {filter} from 'rxjs/operators';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Indicar';
  static baseUrl:string           = 'http://localhost:4200';
  // static urlService:string        = "http://192.168.0.100/processoft/server_indicar/servicios/serviceIndicar.php";
  // static urlService:string        = "http://192.168.0.6r6/processoft/server_indicar/servicios/serviceIndicar.php"; // Trabajo.
  static urlNews:string           = "https://api.weezzy.com.co/indicar/wp-json/wp/v2/posts"; // Noticias.

 // static urlService:string        = "http://35.155.179.167/server_indicar/servicios/serviceIndicar.php"; // PRODUCCION
  // static baseUrl:string           = "https://www.indicar.com.co";

  // entorno test
   static urlService:string        = "https://www.indicar.com.co/server_indicar/servicios/serviceIndicar.php"; // TEST


   //Conexion con integrador

  // static urlIntegrador:string      ="https://integrador.processoft.com.co/api/crm/";

  // static baseUrl:string           = "http://54.213.16.254";

  // entorno produccion
  // static urlService:string        = "http://localhost/indicar-backend/servicios/serviceIndicar.php"; // TEST
  // static baseUrl:string           = "http://35.155.179.167";
  static sizePage:number          = 35;
  static news_per_page:number     = 10;

  constructor(
    private router:Router
  ){
    const navEndEvent$ = this.router.events
    .pipe(
      filter(event=>event instanceof NavigationEnd)
    );
    navEndEvent$.subscribe((event:NavigationEnd)=>{
      gtag('config', 'UA-69013981-1',{
        'page_path':event.urlAfterRedirects
      });
    });
    navEndEvent$.subscribe((event:NavigationEnd)=>{
      gtag('config', 'AW-868808770',{
        'page_path':event.urlAfterRedirects
      });
    });
  }
}
