import { Component, OnInit,Input,
  OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
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

import { lovDepartamento } from '../clases/lov/lovDepartamento.class';
import { lovCiudad } from '../clases/lov/lovCiudad.class';
import { lovPlacaTermina } from '../clases/lov/lovPlacaTermina.class';
import { lovTipoClasificado } from '../clases/lov/lovTipoClasificado.class';

//import * as _ from 'underscore';
 
//import { PaginadorService } from '../servicios/index'

import { AppComponent } from '../app.component';
import {MatChipInputEvent} from '@angular/material';

import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-usado-filtro',
  templateUrl: '../templates/usado.filtro.template.html',
  styleUrls: ['../css/filtros.css']
})

export class UsadoFiltroComponent implements OnInit {
  sub;
  //FILTROS
  p_filtros={};
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
  lovCiudad:lovCiudad[];
  lovDepartamento:lovDepartamento[];
  lovPlacaTermina:lovPlacaTermina[];
  lovTipoClasificado:lovTipoClasificado[];
  //FILTROS
  pfiltro = {};
  @Input() filtros = {
    tipoclasificado: [],
    clase: [],
    marca:[],
    departamento:[],
    ciudad:[],
    precio:[],
    familia:[],
    modelo:[],
    km:[],
    forma:[],
    traccion:[],
    caja:[],
    tipomotor:[],
    capacidad:[],
    placa:[],
    p_descripcion:''
  }


  filmar=false;
  filfam=false;
  fildep=false;
  filciu=false;

  verMarcas= true;
  verFamilias= true;
  verCiudades= true;
  verDepartamento = true;


  cantMarcas:Number;
  cantFamilia:Number;
  cantCiudad:Number;
  cantDepartamento:Number;
  //FILTROS
  @Input() ftipoclasificado;
  @Input() fclase;
  @Input() fmarca;
  @Input() ffamilia;
  @Input() fciudad;
  @Input() fdepartamento;
  @Input() fprecio;
  @Input() fmodelo;
  @Input() fkm;
  @Input() fforma;
  @Input() ftraccion;
  @Input() fcaja;
  @Input() ftipomotor;
  @Input() fcapacidadmotor;
  @Input() fplaca;
  constructor(
    private lovs:lovsServicio,
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router   
  ) { }


  deselectAll() {

      this.p_filtros['p_clase']= "";
      this.p_filtros['p_marca']= "";
      this.p_filtros['p_familia']= "";
      this.p_filtros['p_anno']= "";
      this.p_filtros['p_departamento']= "";
      this.p_filtros['p_clase']= "";
      this.p_filtros['p_forma']= "";
      this.p_filtros['p_caja']= "";
      this.p_filtros['p_modelodesde']= "";
      this.p_filtros['p_modelohasta']= "";
      this.p_filtros['p_traccion']= "";
      this.p_filtros['p_tipomotor']= "";
      this.p_filtros['p_capacidadmotor']= "";
      this.p_filtros['p_preciodesde']= "";
      this.p_filtros['p_preciohasta']= "";
      this.p_filtros['p_kmdesde']= "";
      this.p_filtros['p_kmhasta']= "";
      this.p_filtros['p_capacidadmotordesde']= "";
      this.p_filtros['p_capacidadmotorhasta']= "";

      this.p_filtros['p_ciudad']= "";
      this.p_filtros['p_placatermina']= "";
      this.p_filtros['p_cliente']= "";
      this.p_filtros['p_tipoclasificado']= "";
      this.p_filtros['p_descripcion']= "";
      this.pfiltro = this.p_filtros;
      this.sendRequest2();

      this.router.navigate(['clasificados'], { queryParams: this.pfiltro }); 
  }
  remove(): void { 
    this.p_filtros['p_descripcion']= "";
    this.procesarFiltros();
    this.router.navigate(['clasificados'], { queryParams: this.pfiltro }); 
  }
  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      //console.log("FMARCAAAA",this.fmarca);
      this.p_filtros['p_marca']= params['p_marca'];
      this.p_filtros['p_familia']= params['p_familia'];
      this.p_filtros['p_anno']= params['p_anno'];
      this.p_filtros['p_clase']= params['p_clase'];
      this.p_filtros['p_forma']= params['p_forma'];
      this.p_filtros['p_caja']= params['p_caja'];
      this.p_filtros['p_modelodesde']= params['p_modelodesde'];
      this.p_filtros['p_modelohasta']= params['p_modelohasta'];
      this.p_filtros['p_traccion']= params['p_traccion'];
      this.p_filtros['p_tipomotor']= params['p_tipomotor'];
      this.p_filtros['p_capacidadmotor']= params['p_capacidadmotor'];
      this.p_filtros['p_preciodesde']= params['p_preciodesde'];
      this.p_filtros['p_preciohasta']= params['p_preciohasta'];
      this.p_filtros['p_kmdesde']= params['p_kmdesde'];
      this.p_filtros['p_kmhasta']= params['p_kmhasta'];
      this.p_filtros['p_capacidadmotordesde']= params['p_capacidadmotordesde'];
      this.p_filtros['p_capacidadmotorhasta']= params['p_capacidadmotorhasta'];

      this.p_filtros['p_ciudad']= params['p_ciudad'];
      this.p_filtros['p_departamento']= params['p_departamento']
      this.p_filtros['p_placatermina']= params['p_placatermina'];
      this.p_filtros['p_cliente']= params['p_cliente'];
      this.p_filtros['p_tipoclasificado']= params['p_tipoclasificado'];

      this.p_filtros['p_descripcion']= params['p_descripcion'];
      if(this.p_filtros['p_descripcion']==undefined)
        this.p_filtros['p_descripcion']='';
      //console.log("pdes",this.p_filtros['p_descripcion'])
      this.pfiltro = this.p_filtros;
     // alert('111')
      // this.sendRequest();
      this.sendRequest2();

    });    

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }  

  ngOnChanges(changes: SimpleChanges) {
    const tipoclasificado: SimpleChange = changes.ftipoclasificado;
    const clase: SimpleChange = changes.fclase;
    const marca: SimpleChange = changes.fmarca;
    const ffamilia: SimpleChange = changes.ffamilia;
    const fciudad: SimpleChange = changes.fciudad;
    const fdepartamento: SimpleChange = changes.fdepartamento;
    const fprecio: SimpleChange = changes.fprecio;
    const fmodelo: SimpleChange = changes.fmodelo;
    const fkm: SimpleChange = changes.fkm;
    const fforma: SimpleChange = changes.fforma;
    const ftraccion: SimpleChange = changes.ftraccion;
    const fcaja: SimpleChange = changes.fcaja;
    const ftipomotor: SimpleChange = changes.ftipomotor;
    const fcapacidadmotor: SimpleChange = changes.fcapacidadmotor;
    const fplaca: SimpleChange = changes.fplaca;
    /*console.log('prev value: ', name.previousValue);
    console.log('got name: ', name.currentValue);*/
    this.filtros.tipoclasificado=tipoclasificado.currentValue;
    this.filtros.clase=clase.currentValue;
    this.filtros.marca=marca.currentValue;
    this.filtros.familia=ffamilia.currentValue;
    this.filtros.ciudad=fciudad.currentValue;
    this.filtros.departamento=fdepartamento.currentValue;
    this.filtros.precio=fprecio.currentValue;
    this.filtros.modelo=fmodelo.currentValue;
    this.filtros.km=fkm.currentValue;
    this.filtros.forma=fforma.currentValue;
    this.filtros.traccion=ftraccion.currentValue;
    this.filtros.caja=fcaja.currentValue;
    this.filtros.tipomotor=ftipomotor.currentValue;
    this.filtros.capacidad=fcapacidadmotor.currentValue;
    this.filtros.placa=fplaca.currentValue;
    
//console.log("FMARCA1",this.filtros.marca);
   // this.fmarca = name.currentValue.toUpperCase();
  }

  sendRequest2(){  
    
    //alert('aaaaxcar')
      //GETTIPOCLASIFICADO
      /*
      this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETTIPOCLASIFICADO',         
        this.pfiltro
      )
      .then(result => {      
        this.filtros.tipoclasificado = result.datos ;        
      })
      .catch(error => {        
        alert(error._body)
      });       
      //GETCLASE
      this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCLASE',         
        this.pfiltro
      )
      .then(result => {       
        this.filtros.clase = result.datos ;      
      })
      .catch(error => {        
        alert(error._body)
      });
    
      //MARCA
      this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETMARCA',         
        this.pfiltro
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
      .catch(error => {        
        alert(error._body)
      });  


       //FAMILIA
        this.promiseService.getServiceWithComplexObjectAsQueryString(
          AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETFAMILIA',         
          this.pfiltro
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
        .catch(error => {          
          alert(error._body)
        });  
    //CIUDAD
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCIUDAD',         
      this.pfiltro
    )
    .then(result => {
      this.lovCiudad=result.datos;
      this.filtros.ciudad = result.datos ;     
      //ocultar el ver mas 
      this.cantCiudad=result.registros;
       console.log("cantidad",this.cantCiudad);
      
      if (this.cantCiudad<10) {
          this.verCiudades=false;
           console.log("hola ciudad")
       }else{
         this.verCiudades=true;
       }
    })
    .catch(error => {      
      alert(error._body)
    });  

     //PRECIO
     this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETPRECIO',         
      this.pfiltro
    )
    .then(result => {      
      this.filtros.precio = result.datos ;     
    })
    .catch(error => {      
      alert(error._body)
    });  

     //MODELO
     this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETMODELO2',         
      this.pfiltro
    )
    .then(result => {
      this.filtros.modelo = result.datos ;
    })
    .catch(error => {      
      alert(error._body)
    });  
    
     //KM
     this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETKM2',         
      this.pfiltro
    )
    .then(result => {
      this.filtros.km = result.datos ;
    })
    .catch(error => {      
      alert(error._body)
    });  

    //FORMA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETFORMA', 
      this.pfiltro
    )
    .then(result => {
      this.filtros.forma = result.datos ;
    })
    .catch(error => {      
      alert(error._body)
    });  

     //TRACCION
     this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETTRACCION', 
      this.pfiltro
    )
    .then(result => {
      this.filtros.traccion = result.datos ;
    })
    .catch(error => {      
      alert(error._body)
    });  
      
     //CAJA
     this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCAJA', 
      this.pfiltro
    )
    .then(result => {
      this.filtros.caja = result.datos ;
    })
    .catch(error => {      
      alert(error._body)
    });  

     //TIPOMOTOR
     this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETTIPOMOTOR', 
      this.pfiltro
    )
    .then(result => {
      this.filtros.tipomotor = result.datos ;
    })
    .catch(error => {      
      alert(error._body)
    });  

    //CAPACIDADMOTOR
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCAPACIDADMOTOR', 
      this.pfiltro
    )
    .then(result => {
      this.filtros.capacidad = result.datos ;
    })
    .catch(error => {      
      alert(error._body)
    });  
    
    //CAPACIDADMOTOR
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETPLACATERMINA', 
      this.pfiltro
    )
    .then(result => {
      this.filtros.placa = result.datos ;
    })
    .catch(error => {      
      alert(error._body)
    });    

    */

  }
  sendRequest(){

    
    //CLASIFICADO
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETTIPOCLASIFICADO', 
      this.p_filtros
    )
    .then(result => {
      this.filtros.tipomotor = result.datos ;
      this.filtros.tipoclasificado.map((todo, i) => {
        this.filtros.tipoclasificado[i].selected = false;
       });      
      this.lovTipoClasificado=result.datos;
    })
    .catch(error => console.log(error));
    //CLASE
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCLASE', 
      this.p_filtros
    )
    .then(result => {
      this.filtros.clase = result.datos ;
      this.filtros.clase.map((todo, i) => {
        this.filtros.clase[i].selected = false;
       });      
      this.lovClase=result.datos;
    })
    .catch(error => console.log(error));

    //MARCA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETMARCA', 
      this.p_filtros
    )
    .then(result => {
      this.filtros.marca = result.datos ;
      this.filtros.marca.map((todo, i) => {
        this.filtros.marca[i].selected = false;
       });      
      this.lovMarca=result.datos;
      //console.log(this.lovMarca);
    })
    .catch(error => console.log(error));
    //FAMILIA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETFAMILIA', 
      this.p_filtros
    )
    .then(result => {
      this.lovFamilia=result.datos;
    })
    .catch(error => console.log(error)); 
     //MODELO
     this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETMODELO', 
      this.p_filtros
    )
    .then(result => {
      this.lovAnno=result.datos;
    })
    .catch(error => console.log(error)); 
   
    //FORMA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETFORMA', 
      this.p_filtros
    )
    .then(result => {
      this.lovForma=result.datos;
    })
    .catch(error => console.log(error));
    //CAJA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCAJA', 
      this.p_filtros
    )
    .then(result => {
      this.lovCaja=result.datos;
    })
    .catch(error => console.log(error));
    //TRACCION
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETTRACCION', 
      this.p_filtros
    )
    .then(result => {
      this.lovTraccion=result.datos;
    })
    .catch(error => console.log(error));
    //TIPOMOTOR
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETTIPOMOTOR', 
      this.p_filtros
    )
    .then(result => {
      this.lovTipomotor=result.datos;
    })
    .catch(error => console.log(error));
    //CAPACIDADMOTOR
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCAPACIDADMOTOR', 
      this.p_filtros
    )
    .then(result => {
      this.lovCapacidadmotor=result.datos;
    })
    .catch(error => console.log(error));
    
    
    // DEPARTAMENTO DANIEL BOLIVAR
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETDEPARTAMENTO', 
      this.p_filtros
    )
    .then(result => {
      this.filtros.departamento = result.datos ;
      // this.filtros.departamento.map((todo, i) => {
      //   this.filtros.departamento[i].selected = false;
      //  });      
      this.lovDepartamento=result.datos;
    })
    .catch(error => console.log(error));
    // /.DEPARTAMENTO DANIEL BOLIVAR

    //CIUDAD
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCIUDAD', 
      this.p_filtros
    )
    .then(result => {
      this.lovCiudad=result.datos;
      this.filtros.ciudad = result.datos ;
    })
    .catch(error => console.log(error));

    //PLACA TERMINA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETPLACATERMINA', 
      this.p_filtros
    )
    .then(result => {
      this.lovPlacaTermina=result.datos;
    })
    .catch(error => console.log(error));


    //PRECIOS DESDE
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsadoPrecio&p_filtro=GETPRECIODESDE', 
      this.p_filtros
    )
    .then(result => {
      this.lovPreciosdesde=result.datos;
    })
    .catch(error => console.log(error));


    //PRECIOS HASTA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsadoPrecio&p_filtro=GETPRECIOHASTA', 
      this.p_filtros
    )
    .then(result => {
      this.lovPrecioshasta=result.datos;
    })
    .catch(error => console.log(error));

    
  }
  reload():void{
      //console.log("XDDDD",this.filtros);
      this.router.navigate(['usado'], { queryParams: this.p_filtros });
      //alert('xxxxxx')
      this.sendRequest2();
      // this.sendRequest();



  }
  
  procesarFiltros():void{
    this.p_filtros['p_tipoclasificado']  ='';
    
    this.p_filtros['p_clase']  ='';
    this.p_filtros['p_departamento'] = '';
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
    

    let listMarca:any[] = new Array();  

    
    this.filtros.tipoclasificado.map((selected, i) => {      
      if(this.filtros.tipoclasificado[i].selected){
        if(this.p_filtros['p_tipoclasificado']==''||this.p_filtros['p_tipoclasificado']==undefined) this.p_filtros['p_tipoclasificado']=this.filtros.tipoclasificado[i].codigo;
        else            this.p_filtros['p_tipoclasificado']=this.p_filtros['p_tipoclasificado']+','+this.filtros.tipoclasificado[i].codigo;
      }     
    });

    this.filtros.clase.map((selected, i) => {      
        if(this.filtros.clase[i].selected){
          if(this.p_filtros['p_clase']==''||this.p_filtros['p_clase']==undefined) this.p_filtros['p_clase']=this.filtros.clase[i].codigo;
          else            this.p_filtros['p_clase']=this.p_filtros['p_clase']+','+this.filtros.clase[i].codigo;
        }     
    });

    this.filtros.departamento.map((selected, i) => {      
        if(this.filtros.departamento[i].selected){
          if(this.p_filtros['p_departamento']==''||this.p_filtros['p_departamento']==undefined) this.p_filtros['p_departamento']=this.filtros.departamento[i].codigo;
          else            this.p_filtros['p_departamento']=this.p_filtros['p_departamento']+','+this.filtros.departamento[i].codigo;
        }     
    });

    this.filtros.ciudad.map((selected, i) => {      
      if(this.filtros.ciudad[i].selected){
        if(this.p_filtros['p_ciudad']==''||this.p_filtros['p_ciudad']==undefined) this.p_filtros['p_ciudad']=this.filtros.ciudad[i].codigo;
        else            this.p_filtros['p_ciudad']=this.p_filtros['p_ciudad']+','+this.filtros.ciudad[i].codigo;
      }     
    })    
    this.filtros.marca.map((selected, i) => {      
          if(this.filtros.marca[i].selected){
            listMarca.push(this.filtros.marca[i].codigo);
            if(this.p_filtros['p_marca']==''||this.p_filtros['p_marca']==undefined) this.p_filtros['p_marca']=this.filtros.marca[i].codigo;
            else            this.p_filtros['p_marca']=this.p_filtros['p_marca']+','+this.filtros.marca[i].codigo;
          }     
    })  
    
      this.filtros.familia.map((selected, i) => {      
        if(this.filtros.familia[i].selected){
          
          if(listMarca.indexOf(this.filtros.familia[i].marca)!=-1){
            if(this.p_filtros['p_familia']==''||this.p_filtros['p_familia']==undefined) this.p_filtros['p_familia']=this.filtros.familia[i].codigo;
            else            this.p_filtros['p_familia']=this.p_filtros['p_familia']+','+this.filtros.familia[i].codigo;
          }
          
        }     
      })      
    
    this.filtros.placa.map((selected, i) => {      
      if(this.filtros.placa[i].selected){
        if( this.p_filtros['p_placatermina']==''||this.p_filtros['p_placatermina']==undefined)  this.p_filtros['p_placatermina']=this.filtros.placa[i].codigo;
        else  this.p_filtros['p_placatermina']= this.p_filtros['p_placatermina']+','+this.filtros.placa[i].codigo;
      }     
    })  
    //console.log("XXXXCAR",this.p_filtros['p_clase'] )
    if(this.p_filtros['p_marca']=='')this.p_filtros['p_familia']='';
    this.pfiltro = {
      p_clase                  : this.p_filtros['p_clase'] ,
      p_marca                  : this.p_filtros['p_marca'] ,
      p_departamento           : this.p_filtros['p_departamento'] ,
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
      p_cliente                : this.p_filtros['p_cliente'],
      p_tipoclasificado        : this.p_filtros['p_tipoclasificado'],
      p_descripcion            : this.p_filtros['p_descripcion']
    }  

    // cierro la seccion de los filtros en responsive. add Daniel Bolivar
    var b, bod, dim;
    bod = document.getElementsByTagName('body')[0];
    dim = bod.getBoundingClientRect();
    if(dim.width < 768){
      b = document.querySelector('.btn.filtro-icon-responsive.active');
      b.click();
    }
    

  }
  change():void{      
      //console.log("ABC",this.pfiltro)
      //console.log("DEF",this.p_filtros)
      this.procesarFiltros();
      //this.sendRequest2();    
      this.router.navigate(['clasificados'], { queryParams: this.pfiltro }); 
  }
 
     
  }

 

