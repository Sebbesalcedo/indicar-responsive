import { Component, OnInit } from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-valora',
  templateUrl: '../templates/noticias.template.html',
  styleUrls: ['../css/valora.css']
})

export class NoticiaComponent implements OnInit {

   items;
   totalitems=5;
   totalitems_gangas=0;

  constructor(private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router, private _http: HttpClient) { }

  ngOnInit() {
    this. sendRequest();
  }



  sendRequest(){
    
    //RESULTADO GANGAS
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_noticias',
      {
        //p_tabla:'gangas'
      }       
    )
    .then(result => {
      this.items=result.datos;
      this.totalitems=result.registros
      //this.setPage(1);
    })
    .catch(error => {
      alert(error._body);
    }); 
  }

   detail(pcodigo:string):void{
    this.router.navigate(['clasificados/detalle'], { queryParams: {
      p_codigo:pcodigo
    } });
  }

}

