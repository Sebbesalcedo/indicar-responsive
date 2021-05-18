import { Component, OnInit } from '@angular/core';
import { lovsServicio }   from '../servicios/lovs.servicio';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { lovPreciodesde } from '../clases/lov/lovPreciodesde.class'
import { lovPreciohasta } from '../clases/lov/lovPreciohasta.class';
import { lovMarca } from '../clases/lov/lovMarca.class';
import { lovFamilia } from '../clases/lov/lovFamilia.class';
import { lovAnno } from '../clases/lov/lovAnno.class';
import { lovClase } from '../clases/lov/lovClase.class';
import { lovForma } from '../clases/lov/lovForma.class';
import { lovCaja } from '../clases/lov/lovCaja.class';
import { lovTraccion } from '../clases/lov/lovTraccion.class';
import { lovTipomotor } from '../clases/lov/lovTipomotor.class';
import { lovCapacidadmotor } from '../clases/lov/lovCapacidadmotor.class';
import { ActivatedRoute, Router } from '@angular/router';


//import * as _ from 'underscore';
 
//import { PaginadorService } from '../servicios/index'

import { AppComponent } from '../app.component';

@Component({
  selector: 'app-nuevo-filtro',
  templateUrl: '../templates/nuevo.filtro.template.html',
  styleUrls: ['../css/filtros.css']

})
export class NuevoFiltroComponent implements OnInit {

  filmar=false;
  filfam=false;
  tarjetaFav=false;

  sub;
  //FILTROS
  p_filtros={};
  filtros = {
    clase: [],
    marca:[],
    //ciudad:[],
    precio:[],
    familia:[],
    modelo:[],
    km:[],
    forma:[],
    traccion:[],
    caja:[],
    tipomotor:[],
    capacidad:[]
    //,    placa:[]
  }
  //LOVS
  lovPreciosdesde:lovPreciodesde[];
  lovPrecioshasta:lovPreciohasta[];
  lovMarca:lovMarca[];
  lovFamilia:lovFamilia[];
  lovAnno:lovAnno[];
  lovClase:lovClase[];
  lovForma:lovForma[];
  lovCaja:lovCaja[];
  lovTraccion:lovTraccion[];
  lovTipomotor:lovTipomotor[];
  lovCapacidadmotor:lovCapacidadmotor[];



  verMarcas= true;
  verFamilias= true;

  cantMarcas:Number;
  cantFamilia:Number;
 
  constructor(
    private lovs:lovsServicio,
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router
   
  ) { }

  deselectAll() {

    this.p_filtros['p_marca']= "";
    this.p_filtros['p_familia']= "";
    this.p_filtros['p_anno']= "";;
    this.p_filtros['p_clase']= "";
    this.p_filtros['p_forma']= "";
    this.p_filtros['p_caja']= "";
    this.p_filtros['p_traccion']= "";
    this.p_filtros['p_tipomotor']= "";
    this.p_filtros['p_capacidadmotor']= "";
    this.p_filtros['p_preciodesde']= "";
    this.p_filtros['p_preciohasta']= "";

    this.sendRequest();

    this.router.navigate(['nuevo'], { queryParams: this.p_filtros }); 

  }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.p_filtros['p_marca']= params['p_marca'];
      this.p_filtros['p_familia']= params['p_familia'];
      this.p_filtros['p_anno']= params['p_anno'];
      this.p_filtros['p_clase']= params['p_clase'];
      this.p_filtros['p_forma']= params['p_forma'];
      this.p_filtros['p_caja']= params['p_caja'];
      this.p_filtros['p_traccion']= params['p_traccion'];
      this.p_filtros['p_tipomotor']= params['p_tipomotor'];
      this.p_filtros['p_capacidadmotor']= params['p_capacidadmotor'];
      this.p_filtros['p_preciodesde']= params['p_preciodesde'];
      this.p_filtros['p_preciohasta']= params['p_preciohasta'];
      this.sendRequest();
      
    });
    this.lovPreciosdesde     = this.lovs.getDataHttp_Preciodesde();
    this.lovPrecioshasta     = this.lovs.getDataHttp_Preciohasta();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  sendRequest(){       
    // this.procesarFiltros();
 
     //if($event.source.name != 'clase'){
       //MARCA
       this.promiseService.getServiceWithComplexObjectAsQueryString(
         AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETCLASE',         
         this.p_filtros
       )
       .then(result => {
        // this.lovMarca=result.datos;
         this.filtros.clase = result.datos ;
         //this.filtros.marca.map((todo, i) => { this.filtros.marca[i].selected = false;  });   
         console.log(this.lovMarca);
       })
       .catch(error => console.log(error));
     //}
     
       //MARCA
       this.promiseService.getServiceWithComplexObjectAsQueryString(
         AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETMARCA',         
         this.p_filtros
       )
       .then(result => {
         this.lovMarca=result.datos;
         this.filtros.marca = result.datos ;        
         console.log(this.lovMarca);

         //ocultar el ver mas 
        this.cantMarcas=result.registro;
        
        if (this.cantMarcas<10) {
            this.verMarcas=false;
         }else{
           this.verMarcas=true;
         }

       })
       .catch(error => console.log(error));
 
 
     //if($event.source.name != 'familia'){
         //FAMILIA
         this.promiseService.getServiceWithComplexObjectAsQueryString(
           AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETFAMILIA',         
           this.p_filtros
         )
         .then(result => {
           this.filtros.familia = result.datos ;    
           //ocultar el ver mas 
          this.cantFamilia=result.registros;
          if (this.cantFamilia<10) {
              this.verFamilias=false;
           }else{
             this.verFamilias=true;
           }
         })
         .catch(error => console.log(error)); 
     //}
     
 
      //PRECIO
      this.promiseService.getServiceWithComplexObjectAsQueryString(
       AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETPRECIO',         
       this.p_filtros
     )
     .then(result => {
       //this.lovCiudad=result.datos;
       this.filtros.precio = result.datos ;     
     })
     .catch(error => console.log(error));
 
      //MODELO
      this.promiseService.getServiceWithComplexObjectAsQueryString(
       AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETMODELO2',         
       this.p_filtros
     )
     .then(result => {
       this.filtros.modelo = result.datos ;
     })
     .catch(error => console.log(error)); 
     
    
 
     //FORMA
     this.promiseService.getServiceWithComplexObjectAsQueryString(
       AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETFORMA', 
       this.p_filtros
     )
     .then(result => {
       this.filtros.forma = result.datos ;
     })
     .catch(error => console.log(error));
 
      //TRACCION
      this.promiseService.getServiceWithComplexObjectAsQueryString(
       AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETTRACCION', 
       this.p_filtros
     )
     .then(result => {
       this.filtros.traccion = result.datos ;
     })
     .catch(error => console.log(error));
       
      //CAJA
      this.promiseService.getServiceWithComplexObjectAsQueryString(
       AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETCAJA', 
       this.p_filtros
     )
     .then(result => {
       this.filtros.caja = result.datos ;
     })
     .catch(error => console.log(error));
 
      //TIPOMOTOR
      this.promiseService.getServiceWithComplexObjectAsQueryString(
       AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETTIPOMOTOR', 
       this.p_filtros
     )
     .then(result => {
       this.filtros.tipomotor = result.datos ;
     })
     .catch(error => console.log(error));
 
     //CAPACIDADMOTOR
     this.promiseService.getServiceWithComplexObjectAsQueryString(
       AppComponent.urlservicio+'?_p_action=_filtronuevo&p_filtro=GETCAPACIDADMOTOR', 
       this.p_filtros
     )
     .then(result => {
       this.filtros.capacidad = result.datos ;
     })
     .catch(error => console.log(error));
     
     
   }
  
  reload():void{
      this.router.navigate(['nuevo'], { queryParams: this.p_filtros });
      this.sendRequest();
  }
  procesarFiltros():void{
    
    this.p_filtros['p_clase']  ='';
    this.p_filtros['p_ciudad'] = '';
    //this.p_filtros['p_preciodesde'] = '';
    //this.p_filtros['p_preciohasta'] = '';
    this.p_filtros['p_marca']  = '';
    this.p_filtros['p_familia'] = '';
    //this.p_filtros['p_modelodesde'] = '';
    //this.p_filtros['p_modelohasta'] = '';
    //this.p_filtros['p_kmdesde'] = '';
    //this.p_filtros['p_kmhasta'] = '';
    //this.p_filtros['p_forma'] = '';
    //this.p_filtros['p_traccion'] = '';
    //this.p_filtros['p_caja'] = '';
    //this.p_filtros['p_tipomotor'] = '';
    //this.p_filtros['p_capacidadmotordesde'] = '';
    //this.p_filtros['p_capacidadmotorhasta'] = '';
    this.p_filtros['p_placatermina']  = '';
    
    
    
    this.filtros.clase.map((selected, i) => {      
        if(this.filtros.clase[i].selected){
          if(this.p_filtros['p_clase']==''||this.p_filtros['p_clase']==undefined) this.p_filtros['p_clase']=this.filtros.clase[i].codigo;
          else            this.p_filtros['p_clase']=this.p_filtros['p_clase']+','+this.filtros.clase[i].codigo;
        }     
    });

    
    this.filtros.marca.map((selected, i) => {      
          if(this.filtros.marca[i].selected){
            if(this.p_filtros['p_marca']==''||this.p_filtros['p_marca']==undefined) this.p_filtros['p_marca']=this.filtros.marca[i].codigo;
            else            this.p_filtros['p_marca']=this.p_filtros['p_marca']+','+this.filtros.marca[i].codigo;
          }     
    })         
      this.filtros.familia.map((selected, i) => {      
        if(this.filtros.familia[i].selected){
          if(this.p_filtros['p_familia']==''||this.p_filtros['p_familia']==undefined) this.p_filtros['p_familia']=this.filtros.familia[i].codigo;
          else            this.p_filtros['p_familia']=this.p_filtros['p_familia']+','+this.filtros.familia[i].codigo;
        }     
      })      
    
    
    //console.log("XXXXCAR",this.p_filtros['p_clase'] )
    this.p_filtros = {
      p_clase                  : this.p_filtros['p_clase'] ,
      p_marca                  : this.p_filtros['p_marca'] ,
      p_ciudad                 : this.p_filtros['p_ciudad'] ,
      p_preciodesde            : this.p_filtros['p_preciodesde'] , 
      p_preciohasta            : this.p_filtros['p_preciohasta'] ,       
      p_familia                : this.p_filtros['p_familia'] ,
      p_modelodesde            : this.p_filtros['p_modelodesde'],
      p_modelohasta            : this.p_filtros['p_modelohasta'],
      p_kmdesde                : this.p_filtros['p_kmdesde'],
      p_kmhasta                : this.p_filtros['p_kmhasta'],
      p_forma                  : this.p_filtros['p_forma'],
      p_traccion               : this.p_filtros['p_traccion'], 
      p_caja                   : this.p_filtros['p_caja'],
      p_tipomotor              : this.p_filtros['p_tipomotor'],
      //p_capacidadmotor : this.p_filtros['p_capacidadmotor'] ,
      p_capacidadmotordesde    : this.p_filtros['p_capacidadmotordesde'],
      p_capacidadmotorhasta    : this.p_filtros['p_capacidadmotorhasta'],
      p_placatermina           : this.p_filtros['p_placatermina'] ,
      p_cliente                : this.p_filtros['p_cliente']
    }    
  }
  change():void{      
    //console.log("ABC",this.pfiltro)
    console.log("DEF",this.p_filtros)
    this.procesarFiltros();
    //this.sendRequest2();    
    this.router.navigate(['nuevo'], { queryParams: this.p_filtros }); 
  }
  

 
}
