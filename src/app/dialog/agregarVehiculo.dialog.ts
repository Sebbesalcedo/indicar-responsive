import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {
    FormBuilder, 
    FormGroup,
    Validator,
    ValidatorFn,
      AbstractControl, 
      NG_VALIDATORS ,
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

import { lovTipoContrato } from '../clases/lov/lovTipoContrato.class'
import swal from 'sweetalert2';
import { lovLinea } from '../clases/lov/lovLinea.class';
 @Component({
  selector: 'agegrar-vehiculo.dialog',
  templateUrl: './agregarVehiculo.dialog.html'
})

export class AgregarVehiculoDialogComponent implements OnInit {
  i_tipovehiculo:string;  
  //FORM
  busquedaForm:FormGroup;
  //FILTROS
  p_filtros={
      p_marca:'',
      p_familia:'',
      p_anno:''
  };
  //LOVS
  lovMarca:lovMarca[];
  lovFamilia:lovFamilia[];
  lovAnno:lovAnno[];
  lovLinea:any[];
  
 

  constructor(
      private fb:FormBuilder,
      private promiseService: WebApiPromiseService,
      private route: ActivatedRoute,
      private router: Router,
      public dialogRef: MatDialogRef<AgregarVehiculoDialogComponent> 
    ) {
    this.busquedaForm = fb.group({
      marca: new FormControl({value: ''}),
      familia:new FormControl({value: ''}),
      modelo:new FormControl({value: ''}),
      linea:new FormControl({value: ''})
   
    });
    /*this.busquedaForm.controls['marca'].valueChanges.subscribe(
        (value:string)=>{
            this.p_filtros['p_marca']=value;
            this.p_filtros['p_familia']='';
            this.p_filtros['p_anno']='';
            this.busquedaForm.get("familia").setValue(''); 
            this.busquedaForm.get("modelo").setValue(''); 
            this.busquedaForm.get("linea").setValue(''); 
            this.sendRequest_Usados()            
        }
    )
    this.busquedaForm.controls['familia'].valueChanges.subscribe(
        (value:string)=>{
            this.p_filtros['p_familia']=value;            
            this.p_filtros['p_anno']='';            
            this.busquedaForm.get("modelo").setValue(''); 
            this.busquedaForm.get("linea").setValue(''); 
            this.sendRequest_Usados()            
        }
    )
    this.busquedaForm.controls['modelo'].valueChanges.subscribe(
        (value:string)=>{
            this.p_filtros['p_anno']=value;            
            this.busquedaForm.get("linea").setValue(''); 
            this.sendRequest_Usados()            
        }
    )*/
 
  }
  onChange(field:string){
    switch(field){
      case '1':
        //alert(this.busquedaForm.get("marca").value);
        this.p_filtros['p_marca']=this.busquedaForm.get("marca").value;
        this.p_filtros['p_familia']='';
        this.p_filtros['p_anno']='';
        this.busquedaForm.get("familia").setValue(''); 
        this.busquedaForm.get("modelo").setValue(''); 
        this.busquedaForm.get("linea").setValue(''); 
        this.promiseService.getServiceWithComplexObjectAsQueryString(
          AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETFAMILIA', 
          this.p_filtros
        )
        .then(result => {
          this.lovFamilia=result.datos;
        })
        .catch(error => {          
          alert(error._body)
        });
        this.lovAnno =[];
        this.lovLinea =[];
        //this.sendRequest_Usados();          
      break;
      case '2':
        this.p_filtros['p_familia']=this.busquedaForm.get("familia").value;            
        this.p_filtros['p_anno']='';            
        this.busquedaForm.get("modelo").setValue(''); 
        this.busquedaForm.get("linea").setValue(''); 
        this.promiseService.getServiceWithComplexObjectAsQueryString(
          AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETMODELO', 
          this.p_filtros
        )
        .then(result => {
          this.lovAnno=result.datos;
        })
        .catch(error => {          
          alert(error._body)
        });
        this.lovLinea =[];
        //this.sendRequest_Usados()   
      break;
      case '3':
        this.p_filtros['p_anno']=this.busquedaForm.get("modelo").value;                        
        this.busquedaForm.get("linea").setValue(''); 
        this.promiseService.getServiceWithComplexObjectAsQueryString(
          AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETLINEA', 
          this.p_filtros
        )
        .then(result => {
          this.lovLinea =result.datos;
        })
        .catch(error => {          
          alert(error._body)
        });
        //this.sendRequest_Usados()        
      break;
      case '4':
      break;
      default:
      break;
    }
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
    //this.sendRequest_Usados();
  }

  sendRequest_Usados(){


            this.p_filtros['p_anno']='';


  

    //this.lovDepartamento=[];
    //MARCA
  
   
       //FAMILIA
    if(this.p_filtros['p_marca']!='')
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
       if(this.p_filtros['p_familia']!='')
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
        //LINEA
        if(this.p_filtros['p_anno']!='')
        this.promiseService.getServiceWithComplexObjectAsQueryString(
          AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETLINEA', 
          this.p_filtros
        )
        .then(result => {
          this.lovLinea =result.datos;
        })
        .catch(error => {
          //console.log(error)
          alert(error._body)
        });

  }    
  clearFilter(){
    this.p_filtros={
        p_marca:'',
        p_familia:'',
        p_anno:''
    };
    this.lovMarca=[]
    this.lovFamilia=[]
    this.lovAnno=[];
    this.lovLinea=[];

  }
  addVehiculo(){
    if( this.busquedaForm.get("linea").value == ''){
      swal(
        AppComponent.tituloalertas,
        'Es necesario selecionar una Linea',
        'info'
      );
      return;
    }
    let tlovLinea:any;
    this.lovLinea.forEach(element2 => {
      
      if(element2.codigo == this.busquedaForm.get("linea").value ){
        tlovLinea=element2;
       
      }  
       
    });
    this.dialogRef.close({
      codigo: this.busquedaForm.get("linea").value,
      lineData: tlovLinea
    });
  }
  

}