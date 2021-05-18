import { Component, OnInit,Input,SimpleChanges,SimpleChange } from '@angular/core';
import { lovsServicio }   from '../servicios/lovs.servicio';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { lovMarca } from '../clases/lov/lovMarca.class';

import { ActivatedRoute, Router } from '@angular/router';

import { lovCiudad } from '../clases/lov/lovCiudad.class';

import { lovTipoClasificado } from '../clases/lov/lovTipoClasificado.class';

//import * as _ from 'underscore';
 
//import { PaginadorService } from '../servicios/index'

import { AppComponent } from '../app.component';


import { NgModel } from '@angular/forms';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {startWith, map} from 'rxjs/operators';

export interface CiudadGroup {
  ciudad: string;
  concesionarios: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-concesionario-filtro',
  templateUrl: '../templates/mapa.filtro.concesionario.template.html',
  styleUrls: ['../css/filtros.css']
})

export class MapaConcesionarioFiltroComponent implements OnInit {
  sub;
  //FILTROS
  p_filtros={};
  stateForm: FormGroup;
  arrConcesionario:CiudadGroup[]=[];
  //LOVS

  lovMarca:lovMarca[];
  lovCiudad:lovCiudad[];
  lovTipoClasificado:lovTipoClasificado[];
  //FILTROS
  pfiltro = {};
 
  @Input() filtros = {
    tipoclasificado: [],  
    marca:[],
    ciudad:[],
    concesionario:[]
  }


  filmar=false;

  filciu=false;

  verMarcas= true;

  verCiudades= true;


  cantMarcas:Number;

  cantCiudad:Number;

   //FILTROS
   @Input() ftipoclasificado;   
   @Input() fmarca;   
   @Input() fciudad;  
   @Input() fconcesionario;    

  constructor(
    private lovs:lovsServicio,
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder 
   
  ) { }


  deselectAll() {      
      this.p_filtros['p_marca']= "";
      this.p_filtros['p_ciudad']= "";
      this.p_filtros['p_tipoclasificado']= "";
      this.p_filtros['p_concesionario']= "";
      this.pfiltro = this.p_filtros;
      this.sendRequest2();

      this.router.navigate(['clasificados'], { queryParams: this.pfiltro }); 



  }
  
  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.p_filtros['p_marca']= params['p_marca'];
      this.p_filtros['p_ciudad']= params['p_ciudad'];
      this.p_filtros['p_tipoclasificado']= params['p_tipoclasificado'];
      this.p_filtros['p_concesionario']= params['p_nombreconce'];

      
      this.pfiltro = this.p_filtros;
      //this.sendRequest2();
    });  

    this.stateForm = this.fb.group({
      stateGroup: '',
    });
    this.stateForm.get("stateGroup").setValue(this.p_filtros['p_concesionario']);
    
   
    
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterGroup(value))
    );

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }  

  ngOnChanges(changes: SimpleChanges) {
    const tipoclasificado: SimpleChange = changes.ftipoclasificado;    
    const marca: SimpleChange = changes.fmarca;    
    const fciudad: SimpleChange = changes.fciudad; 
    const fconcesionario: SimpleChange = changes.fconcesionario; 
    
  
    this.filtros.tipoclasificado=tipoclasificado.currentValue;    
    this.filtros.marca=marca.currentValue;    
    this.filtros.ciudad=fciudad.currentValue;    
    this.filtros.concesionario=fconcesionario.currentValue; 
    
    //var arrConcesionario:string[];
    this.arrConcesionario=[];
    console.log("LENTTT",this.filtros.concesionario);
    if(this.filtros.concesionario!=undefined)
    if(this.filtros.concesionario.length>0)
    for (let entry of this.filtros.concesionario) {
      console.log("000",this.arrConcesionario);
      //console.log("111",arrConcesionario.indexOf(entry.ciudad));
      //console.log("222",arrConcesionario.find(i => i.ciudad === entry.ciudad));
      if(this.arrConcesionario.find(i => i.ciudad === entry.ciudad)==undefined){
      //if(arrConcesionario.indexOf(entry.ciudad)==-1){        
        this.arrConcesionario.push({
          'ciudad':entry.ciudad,
          'concesionarios':[
            entry.descripcion
          ]
        });
      }else{
        this.arrConcesionario.find(i => i.ciudad === entry.ciudad).concesionarios.push(
          entry.descripcion
        );   
        
      }
      console.log("XCAR1",entry); // 1, "string", false
      console.log("XCAR2",this.arrConcesionario); // 1, "string", false
    }
  

  }
  stateGroupOptions: Observable<CiudadGroup[]>;

  private _filterGroup(value: string): CiudadGroup[] {
    //console.log("CHANGE",this.arrConcesionario);
    if (value) {
     /* console.log("CHANGE 2",
      this.arrConcesionario
        .map(group => ({ciudad: group.ciudad, concesionarios: _filter(group.concesionarios, value)}))
        .filter(group => group.concesionarios.length > 0)
      ;*/
      return this.arrConcesionario
        .map(group => ({ciudad: group.ciudad, concesionarios: _filter(group.concesionarios, value)}))
        .filter(group => group.concesionarios.length > 0);
    }    
    return this.arrConcesionario;
  }
  displayFn(ciudad?: any): string | undefined {
    console.log("ciudad", ciudad)
    return ciudad ? ciudad.ciudad_nombre : undefined;
  }

  sendRequest2(){  
      //GETTIPOCLASIFICADO
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



  }
  sendRequest(){

  
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
  


    //CIUDAD
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroCliente&p_filtro=GETCIUDAD', 
      this.p_filtros
    )
    .then(result => {
      this.lovCiudad=result.datos;
      this.filtros.ciudad = result.datos ;
    })
    .catch(error => console.log(error));

    
  }
  reload():void{
      //console.log("XDDDD",this.filtros);
      this.router.navigate(['usado'], { queryParams: this.p_filtros });
      this.sendRequest2();


  }
  
  procesarFiltros():void{
    this.p_filtros['p_tipoclasificado']  ='';
    this.p_filtros['p_ciudad'] = '';
    this.p_filtros['p_marca']  = '';
    this.p_filtros['p_placatermina']  = '';
   // this.p_filtros['p_concesionario']  = '';
    
    
    this.filtros.tipoclasificado.map((selected, i) => {      
      if(this.filtros.tipoclasificado[i].selected){
        if(this.p_filtros['p_tipoclasificado']==''||this.p_filtros['p_tipoclasificado']==undefined) this.p_filtros['p_tipoclasificado']=this.filtros.tipoclasificado[i].codigo;
        else            this.p_filtros['p_tipoclasificado']=this.p_filtros['p_tipoclasificado']+','+this.filtros.tipoclasificado[i].codigo;
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
            if(this.p_filtros['p_marca']==''||this.p_filtros['p_marca']==undefined) this.p_filtros['p_marca']=this.filtros.marca[i].codigo;
            else            this.p_filtros['p_marca']=this.p_filtros['p_marca']+','+this.filtros.marca[i].codigo;
          }     
    })         
        
 
    //console.log("XXXXCAR",this.p_filtros['p_clase'] )
    this.pfiltro = {
     
      p_marca             : this.p_filtros['p_marca'] ,
      p_ciudad            : this.p_filtros['p_ciudad'] ,     
      p_tipoclasificado   : this.p_filtros['p_tipoclasificado'],     
      p_nombreconce       : this.p_filtros['p_concesionario']
    }  


  }
  change():void{      
    //  console.log("ABC",this.pfiltro)
    //  console.log("DEF",this.p_filtros)
      this.procesarFiltros();
      //this.sendRequest2();    
      this.router.navigate(['concesionarios'], { queryParams: this.pfiltro }); 
  }
  buscar_nombre(event: any){    
    console.log("EVENT 2",this.stateForm.controls.stateGroup.value);
    this.p_filtros['p_concesionario']  =event    
    this.change();    
  }
  eliminar_nombre(){    
    this.p_filtros['p_concesionario']  = ''   ;
    this.stateForm.get("stateGroup").setValue(this.p_filtros['p_concesionario']); 
    this.change();    
  }
 
     
  }

 

