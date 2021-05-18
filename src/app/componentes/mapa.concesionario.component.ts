import { Component, OnInit } from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-usado',
  templateUrl: '../templates/mapa.concesionario.template.html',
  styleUrls: ['../css/vitrina.css']
})
export class MapaConcesionarioComponent implements OnInit {
  filtroR=false;
  sub;
  //FILTROS
  p_filtros={};
  //RESULTADO
  items;
  total_items=100;
  cliente;
  telefonos;
  iscliente=false;
  public loading = false;

  ftipoclasificado:any;  
  fmarca:any;  
  fciudad:any;  
  fconcesionario:any;  

  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    

    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.p_filtros['p_marca']= params['p_marca'];
      this.p_filtros['p_ciudad']= params['p_ciudad'];
      this.p_filtros['p_tipoclasificado']= params['p_tipoclasificado'];
      this.p_filtros['p_nombreconce']= params['p_nombreconce'];

      this.p_filtros['p_orderby']= params['p_orderby'];

      this.p_filtros['p_descripcion']= params['p_descripcion'];
      
      this.sendRequest();
      window.scrollTo(0, 0)
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  sendRequest(){
    this.loading = true;
    this.iscliente=false;
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_mapaconcesionario', 
      Object.assign(
        this.p_filtros,
        {
          currentPage : 1,
          sizepage    : AppComponent.paginasize,
          p_modo      : 'CONCESIONARIO'
        }
      )
    )
    .then(result => {     
      this.cliente=result.cliente;      
      if(this.cliente.cliente_codigo!=undefined){
        this.iscliente=true;
        this.telefonos=JSON.parse(this.cliente.data);        
      }  
      this.items=result.fconcesionario;      
      this.total_items=result.fconcesionario.length

      this.ftipoclasificado = result.ftipoclasificado ;      
      this.fmarca           = result.fmarca ;
      this.fciudad          = result.fciudad ;
      this.fconcesionario   = result.fconcesionario ;

      
      

      this.loading = false;      
    })
    .catch(error => {
      console.log(error);
      this.loading = false;
    }); 
  }
  reload():void{
      this.router.navigate(['usado'], { queryParams: this.p_filtros });
      this.sendRequest();
  }
  setPage(paginador: any) {
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getItemsUsado', 
      Object.assign(
        this.p_filtros,
        {
          currentPage : paginador.currentPage,
          sizePage    : AppComponent.paginasize
        }
      )
    )     
    .then(result => {
      this.items=result.datos;
      this.total_items=result.registros
      window.scrollTo(0, 0)
    })
    .catch(error => console.log(error)); 
  }
 
}
