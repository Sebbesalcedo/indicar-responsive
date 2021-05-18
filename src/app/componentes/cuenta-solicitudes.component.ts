import { Component, OnInit } from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { currentUser } from '../interface/currentuser.interface';
@Component({
  selector: 'app-cuenta-favorito',
  templateUrl: '../templates/cuenta.solicitudes.template.html'
  //,styleUrls: ['./heroes.component.css']
})
export class CuentaSolicitudesComponent implements OnInit {
  error = '';
  sub;
  //FILTROS
  p_filtros={};
  //RESULTADO
  //RESULTADO
  items;
  total_items=100;
  currentuser:currentUser;

  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.currentuser = JSON.parse(localStorage.getItem("currentUser"));

    //console.log("userc111",JSON.parse(localStorage.getItem("currentUser")).token)

    //console.log("userc",localStorage.getItem("currentUser"))

    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.p_filtros['p_token']= JSON.parse(localStorage.getItem("currentUser")).token;
      this.sendRequest();
      window.scrollTo(0, 0)
    });
    this.sub = this.route
    .params
    .subscribe(params => {
      this.p_filtros['p_token']= JSON.parse(localStorage.getItem("currentUser")).token;
      this.p_filtros['p_estado']= params["p_estado"];
      this.sendRequest();
      window.scrollTo(0, 0)
    });

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  sendRequest(){
    
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getSolicitudesFinanciamiento', 
      Object.assign(
        this.p_filtros,
        {
          currentPage : 1,
          sizepage    : AppComponent.paginasize
        }
      )
    )
    .then(result => {
      this.items=result.datos;
      this.total_items=result.registros
      //this.setPage(1);
    })
    .catch(error => {
        this.error=error._body;
       // console.log("ERRRORRR",error._body)
    }); 
  }
  detail(pcodigo:string,ptipo:string,panno:string):void{
    if(ptipo="USADO")  
        this.router.navigate(['clasificados/detalle'], { queryParams: {
        p_codigo:pcodigo
        } });
    else
        this.router.navigate(['nuevo/detalle'], { queryParams: {
            p_codigo:pcodigo,
            p_anno:panno
      } });
}
  


 
}
