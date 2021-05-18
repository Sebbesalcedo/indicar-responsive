import { Component, OnInit } from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Event } from '@angular/router';
import { HostListener } from "@angular/core";
import { Observable } from 'rxjs';
import { stringify } from '@angular/core/src/util';
import { EncryptService } from '../servicios/encrypt.service'
@Component({
  selector: 'app-usado',
  templateUrl: '../templates/usado.template.html',
  styleUrls: ['../css/vitrina.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class UsadoComponent implements OnInit {
  tarjetaFav=false;
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
  isResponsive=false;


  
  ftipoclasificado:any;
  fclase:any;
  fmarca:any;
  ffamilia:any;
  fciudad:any;
  fdepartamento:any;
  fprecio:any;
  fmodelo:any;
  fkm:any;
  fforma:any;
  ftraccion:any;
  fcaja:any;
  ftipomotor:any;
  fcapacidadmotor:any;
  fplaca:any;

  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router,
    private Encrypt: EncryptService
  ) { }
  ngOnInit() {
    //alert('11');
    //alert(window.innerWidth);
    if(window.innerWidth< 769){
      this.isResponsive=true;
    }else{
      this.isResponsive=false;
    }
    
    this.sub = this.route.queryParams.subscribe(params => {
      this.p_filtros['p_marca']               = params['p_marca'];
      this.p_filtros['p_familia']             = params['p_familia'];
      this.p_filtros['p_anno']                = params['p_anno'];
      this.p_filtros['p_departamento']        = params['p_departamento'];
      this.p_filtros['p_clase']               = params['p_clase'];
      this.p_filtros['p_forma']               = params['p_forma'];
      this.p_filtros['p_caja']                = params['p_caja'];
      this.p_filtros['p_modelodesde']         = params['p_modelodesde'];
      this.p_filtros['p_modelohasta']         = params['p_modelohasta'];
      this.p_filtros['p_traccion']            = params['p_traccion'];
      this.p_filtros['p_tipomotor']           = params['p_tipomotor'];
      this.p_filtros['p_capacidadmotor']      = params['p_capacidadmotor'];
      this.p_filtros['p_preciodesde']         = params['p_preciodesde'];
      this.p_filtros['p_preciohasta']         = params['p_preciohasta'];
      this.p_filtros['p_kmdesde']             = params['p_kmdesde'];
      this.p_filtros['p_kmhasta']             = params['p_kmhasta'];
      this.p_filtros['p_capacidadmotordesde'] = params['p_capacidadmotordesde'];
      this.p_filtros['p_capacidadmotorhasta'] = params['p_capacidadmotorhasta'];
      this.p_filtros['p_ciudad']              = params['p_ciudad'];
      this.p_filtros['p_placatermina']        = params['p_placatermina'];
      this.p_filtros['p_cliente']             = params['p_cliente'];
      this.p_filtros['p_tipoclasificado']     = params['p_tipoclasificado'];
      this.p_filtros['p_orderby']             = params['p_orderby'];
      this.p_filtros['p_descripcion']         = params['p_descripcion'];

      this.p_filtros['currentPage']           = params['currentPage'];
      this.sendRequest(this.p_filtros['currentPage']);
      window.scrollTo(0, 0);
    });
  }
  onResize(event){
    if(window.innerWidth< 769){
      this.isResponsive=true;
    }else{
      this.isResponsive=false;
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  sendRequest(cPage=1){
    this.loading = true;
    this.iscliente=false;
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getItemsUsado2019', 
      Object.assign(
        this.p_filtros,
        {
          currentPage : cPage,
          sizepage    : AppComponent.paginasize
        }
      )
    )
    .then(result => {
      var groupByName = {};
/*
      result.datos.forEach(function (a) {
        groupByName [a.marca_nombre] = groupByName [a.marca_nombre] || [];
        groupByName [a.marca_nombre].push({ codigo: a.marca_codigo, nombre:a.marca_nombre });
      });

       console.log("GB",groupByName)     
  */
      //this.cliente.length
      this.cliente=result.cliente;
      //console.log("LENGH",this.cliente.length)
      //console.log("LENGH",this.cliente)
      if(this.cliente.cliente_codigo!=undefined){
        this.iscliente=true;
        this.telefonos=JSON.parse(this.cliente.data);
        //console.log("TELEFONOS",this.telefonos)
      }
      result.datos.forEach(clasificado => {
        clasificado.venta_codigo = this.Encrypt.encrypt(clasificado.venta_codigo);
      });
      this.items=result.datos;

      this.ftipoclasificado = result.ftipoclasificado ;
      this.fclase           = result.fclase ;
      this.fmarca           = result.fmarca ;
      this.ftipoclasificado = result.ftipoclasificado ;
      this.fclase           = result.fclase ;
      this.fmarca           = result.fmarca ;
      this.ffamilia         = result.ffamilia ;
      this.fciudad          = result.fciudad ;
      this.fdepartamento    = result.fdepartamento ;
      this.fprecio          = result.fprecio ;
      this.fmodelo          = result.fmodelo ;
      this.fkm              = result.fkm ;
      this.fforma           = result.fforma ;
      this.ftraccion        = result.ftraccion ;
      this.fcaja            = result.fcaja ;
      this.ftipomotor       = result.ftipomotor ;
      this.fcapacidadmotor  = result.fcapacidadmotor ;
      this.fplaca           = result.fplaca ;
      
      //console.log("FMARCA",result.fmarca);
      this.total_items=result.registros
      this.loading = false;
      //console.log("ITEMSSSSSs",this.items)
      //this.setPage(1);
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

  setPage(paginador:any){
    this.p_filtros["currentPage"]=paginador.currentPage;
    this.router.navigate(['clasificados'], { queryParams: this.p_filtros }); 
    //this.router.navigate(['/clasificados/pagina/'+paginador.currentPage], { preserveQueryParams: true });
    /*------------------- DEPRECIATED ------------------- */
    /*this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getItemsUsado2019', 
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
    .catch(error => console.log(error));*/
    /*------------------- ./ DEPRECIATED ------------------- */
  }
}
