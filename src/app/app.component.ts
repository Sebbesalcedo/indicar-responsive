import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Indicar';
  static baseUrl:string           = 'http://localhost:4200';
  static urlService:string        = "http://192.168.0.100/processoft/server_indicar/servicios/serviceIndicar.php"; 
  // static urlService:string        = "http://192.168.0.6r6/processoft/server_indicar/servicios/serviceIndicar.php"; // Trabajo.
  static urlNews:string           = "https://api.weezzy.com.co/indicar/wp-json/wp/v2/posts"; // Noticias.
  
  // static urlService:string        = "https://www.indicar.com.co/server_indicar/servicios/serviceIndicar.php"; // PRODUCCION
  // static baseUrl:string           = "https://www.indicar.com.co";

  // entorno test
  // static urlService:string        = "http://54.213.16.254/server_indicar/servicios/serviceIndicar.php"; // TEST
  // static baseUrl:string           = "http://54.213.16.254";
  
  // entorno produccion
  // static urlService:string        = "http://35.155.179.167/server_indicar/servicios/serviceIndicar.php"; // TEST
  // static baseUrl:string           = "http://35.155.179.167";
  static sizePage:number          = 35;
  static news_per_page:number     = 10;
}