import { Component, OnInit} from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';




@Component({
  selector: 'app-valora',
  templateUrl: '../templates/noticias.detalle.template.html',
  styleUrls: ['../css/valora.css']
})

export class NoticiaDetalleComponent implements OnInit {

   item;
   totalitem=5;
   p_consecutivo:any;
   totalitems_gangas=0;

   //shares redes sociales
    url = 'http://jasonwatmore.com';
    text = `Jason Watmore's Blog | A Web Developer in Sydney`;
    imageUrl = 'http://jasonwatmore.com/_content/images/jason.jpg';

  constructor(private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router, private _http: HttpClient) { }

  ngOnInit() {
    //this. sendRequest();
    //VALIDAR SI ESTA EN MODO MODIFICAR
    if (this.route.snapshot.paramMap.get('id') != null) {
        this.p_consecutivo=this.route.snapshot.paramMap.get('id');
        this.get_record(this.route.snapshot.paramMap.get('id'))
    }else{                        
        this.p_consecutivo=null;       
    }
  }



  get_record(p_consecutivo:string){
    
    //RESULTADO GANGAS
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_noticias',
      {
        p_consecutivo:p_consecutivo
      }       
    )
    .then(result => {
      this.item=result.datos;
      this.totalitem=result.registros
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

