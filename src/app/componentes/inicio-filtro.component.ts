import { Component, OnInit } from '@angular/core';
import {
    FormBuilder, 
    FormGroup,
    Validator,
    ValidatorFn,
      AbstractControl, 
      FormControl, 
      NG_VALIDATORS ,
      Validators
  } from '@angular/forms'
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
import { AppComponent } from '../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { lovTipoClasificado } from '../clases/lov/lovTipoClasificado.class';
import { lovDepartamento } from '../clases/lov/lovDepartamento.class';

@Component({
  selector: 'app-inicio-filtro',
  templateUrl: '../templates/inicio.filtro.template.html',
  styleUrls: ['../css/inicio.css']
})

export class InicioFiltroComponent implements OnInit {
  i_tipovehiculo:string;  
  //FORM
  busquedaForm:FormGroup;
  //FILTROS
  p_filtros={
      p_tipoclasificado:'',
      p_marca:'',
      p_familia:'',
      p_anno:'',
      p_departamento:'',
      p_clase:'',
      p_precio:''
  };
  //LOVS
  lovPrecios:lovPreciodesde[];
  lovMarca:lovMarca[];
  lovFamilia:lovFamilia[];
  lovAnno:lovAnno[];
  lovClase:lovClase[];
  lovForma:lovForma[];
  lovCaja:lovCaja[];
  lovTraccion:lovTraccion[];
  lovTipomotor:lovTipomotor[];
  lovCapacidadmotor:lovCapacidadmotor[];
  lovDepartamento:lovDepartamento[];
  lovTipoClasificado:lovTipoClasificado[];

  constructor(
      private fb:FormBuilder,
      private promiseService: WebApiPromiseService,
      private route: ActivatedRoute,
      private router: Router
    ) {
    this.busquedaForm = fb.group({
      tipo: new FormControl('')  ,
      marca: new FormControl({value: ''}),
      familia:new FormControl({value: ''}),
      modelo:new FormControl({value: ''}),
      departamento:new FormControl({value: ''}),
      clase:new FormControl({value: ''}),
      precio:new FormControl({value: ''})
    });
    /*this.busquedaForm.controls['tipo'].valueChanges.subscribe(
        (value:string)=>{
            this.clearFilter();
            
            this.p_filtros['p_tipo']=value;
            //console.log("marca")
            if(value=="N")this.sendRequest_Nuevos();
            else if(value=="U") this.sendRequest_Usados();
            //else this.clearFilter()
            this.i_tipovehiculo=value;
            if(value=="U"){
                this.busquedaForm.controls['marca'].enable({emitEvent:false}); 
                this.busquedaForm.controls['familia'].enable({emitEvent:false}); 
                this.busquedaForm.controls['clase'].enable({emitEvent:false}); 
                this.busquedaForm.controls['modelo'].enable({emitEvent:false}); 
                this.busquedaForm.controls['precio'].enable({emitEvent:false}); 
                this.busquedaForm.controls['departamento'].enable({emitEvent:false}); 
            }   
            else if(value=="N"){
                this.busquedaForm.controls['marca'].enable({emitEvent:false}); 
                this.busquedaForm.controls['familia'].enable({emitEvent:false}); 
                this.busquedaForm.controls['clase'].enable({emitEvent:false}); 
                this.busquedaForm.controls['modelo'].enable({emitEvent:false}); 
                this.busquedaForm.controls['precio'].enable({emitEvent:false}); 
                this.busquedaForm.controls['departamento'].disable({emitEvent:false});
            }else{
                this.busquedaForm.controls['marca'].disable({emitEvent:false}); 
                this.busquedaForm.controls['familia'].disable({emitEvent:false}); 
                this.busquedaForm.controls['clase'].disable({emitEvent:false}); 
                this.busquedaForm.controls['modelo'].disable({emitEvent:false}); 
                this.busquedaForm.controls['precio'].disable({emitEvent:false}); 
                this.busquedaForm.controls['departamento'].disable({emitEvent:false}); 
            }
              
        }
    )*/
    this.busquedaForm.controls['clase'].valueChanges.subscribe(
      (value:string)=>{
          this.p_filtros['p_clase']=value;
          this.sendRequest_Usados()          
      }
    )
    this.busquedaForm.controls['tipo'].valueChanges.subscribe(
      (value:string)=>{
          this.p_filtros['p_tipoclasificado']=value;
          this.sendRequest_Usados()          
      }
    )
    this.busquedaForm.controls['marca'].valueChanges.subscribe(
        (value:string)=>{
            this.p_filtros['p_marca']=value;
            this.sendRequest_Usados()            
        }
    )
    this.busquedaForm.controls['familia'].valueChanges.subscribe(
        (value:string)=>{
            this.p_filtros['p_familia']=value;
            this.sendRequest_Usados()            
        }
    )
    this.busquedaForm.controls['modelo'].valueChanges.subscribe(
        (value:string)=>{
            this.p_filtros['p_anno']=value;
            this.sendRequest_Usados()            
        }
    )
    this.busquedaForm.controls['departamento'].valueChanges.subscribe(
        (value:string)=>{
            this.p_filtros['p_departamento']=value;
            this.sendRequest_Usados()            
        }
    )   
  }
  onSubmit(value:string){      
    //alert(value)
    this.router.navigate(['clasificados'], { queryParams: this.p_filtros });     
  }
  sendSearch(){      
    //alert('aaaaa')
    //console.log("filtros",this.p_filtros)
    this.router.navigate(['clasificados'], { queryParams: this.p_filtros });     
  }
  ngOnInit() {
    this.sendRequest_Usados();
  }
  /*sendRequest_Nuevos(){
    //MARCA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltro&p_filtro=GETMARCA', 
      this.p_filtros
    )
    .then(result => {
      this.lovMarca=result.datos;
    })
    .catch(error => console.log(error));
    //FAMILIA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltro&p_filtro=GETFAMILIA', 
        this.p_filtros
      )
      .then(result => {
        this.lovFamilia=result.datos;
      })
      .catch(error => console.log(error)); 
       //MODELO
       this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltro&p_filtro=GETMODELO', 
        this.p_filtros
      )
      .then(result => {
        this.lovAnno=result.datos;
      })
      .catch(error => console.log(error));
       //CLASE
    this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltro&p_filtro=GETCLASE', 
        this.p_filtros
      )
      .then(result => {
        this.lovClase=result.datos;
      })
      .catch(error => console.log(error));
      this.lovDepartamento=[];
      //this.busquedaForm.controls['departamento'].disable();



    //PRECIOS DESDE
    this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltro&p_filtro=GETPRECIONUEVO', 
        this.p_filtros
      )
      .then(result => {
        this.lovPrecios=result.datos;
        console.log("precios desde",this.lovPrecios);
      })
      .catch(error => console.log(error));
  }   */
  sendRequest_Usados(){
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getItemsUsado2019', 
      Object.assign(
        this.p_filtros,
        {
          currentPage : 1,
          sizepage    : AppComponent.paginasize
        }
      )
    )
    .then(result => {
      this.lovTipoClasificado=result.ftipoclasificado
      this.lovMarca=result.fmarca;
      this.lovFamilia=result.ffamilia;      
      this.lovClase=result.fclase;
      this.lovDepartamento=result.fdepartamento;
      this.lovAnno=result.fmodelo;
    })
    .catch(error => {
      alert(error._body)
      //console.log(error);
      //this.loading = false;
    }); 

    /*
    //MARCA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETTIPOCLASIFICADO', 
      this.p_filtros
    )
    .then(result => {
      this.lovTipoClasificado=result.datos;
      //console.log(this.lovMarca);
    })
    .catch(error => {
      //console.log(error)
      alert(error._body)
    });

    //this.lovDepartamento=[];
    //MARCA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETMARCA', 
        this.p_filtros
      )
      .then(result => {
        this.lovMarca=result.datos;
        //console.log(this.lovMarca);
      })
      .catch(error => {
        //console.log(error)
        alert(error._body)
      });
       //FAMILIA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETFAMILIA', 
        this.p_filtros
      )
      .then(result => {
        this.lovFamilia=result.datos;
      })
      .catch(error => {
        //console.log(error)
        alert(error._body)
      });
       //MODELO
       this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETMODELO', 
        this.p_filtros
      )
      .then(result => {
        this.lovAnno=result.datos;
      })
      .catch(error => {
        //console.log(error)
        alert(error._body)
      });
      //CLASE
    this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETCLASE', 
        this.p_filtros
      )
      .then(result => {
        this.lovClase=result.datos;
      })
      .catch(error => {
        //console.log(error)
        alert(error._body)
      });
      //departamento
    this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETDEPARTAMENTO', 
        this.p_filtros
      )
      .then(result => {
        this.lovDepartamento=result.datos;
      })
      .catch(error => {
        //console.log(error)
        alert(error._body)
      });

    
    //PRECIOS DESDE
    this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETPRECIOUSADO', 
        this.p_filtros
      )
      .then(result => {
        this.lovPrecios=result.datos;
      })
      .catch(error => {
        //console.log(error)
        alert(error._body)
      });
      */
  }    
  clearFilter(){
    this.p_filtros={
        p_tipoclasificado:'',
        p_marca:'',
        p_familia:'',
        p_anno:'',
        p_departamento:'',
        p_clase:'',
        p_precio:''
    };
    this.lovMarca=[]
    this.lovFamilia=[]
    this.lovClase=[];
    this.lovAnno=[];
    this.lovDepartamento=[];
    this.lovPrecios=[];
  }

}