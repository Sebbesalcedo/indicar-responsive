import { Component, Inject, Output, EventEmitter } from '@angular/core';
// dependencias
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import swal from 'sweetalert2';

// SERVICIOS
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';

export interface DialogData {
  login: boolean;
}

@Component({
  selector: 'usado-detalle-dialog',
  templateUrl: 'usado-detalle.dialog.html',
})

export class UsadoDetalleDialog{
  // VARIABLES
  cuser:any             = null;
  view:string           = null;
  // mask
  public maskPhone      = "(000) 000 0000";

  // FORMULARIOS
  formQuestion:any;
  formSold:any;
  formDelete:any;

  saleOptions:any           = [];
  deleteOptions:any         = [];
  viewAnotherWay:boolean    = false;
  detalle:string        = null;
  back:boolean              = false;

  // OUTPUT
  @Output() loading = new EventEmitter();
  @Output() closeDialog = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private WebApiService:WebApiService,
    private snackBar:MatSnackBar
  ){
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    this.initForms();
  }
  /**
   * @description   Metodo usado para iniciar el formulario correspondiente en seccion de usado detalle.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.1
   * @since         23-12-2019
   */
  initForms(){
    this.view = this.data.window;
    switch(this.view){
      case 'delete':  // formulario de vendido
     console.log(this.data);
        this.deleteOptions = this.data.deleteOptions;
        this.formDelete = new FormGroup({
          fparametro: new FormControl('',Validators.required)
        });
      break;
      case 'sold':  // formulario de vendido
        this.saleOptions   = this.data.saleOptions;
        console.log(this.saleOptions );
        this.back          = this.data.from;
        this.formSold = new FormGroup({
          fparametro: new FormControl('',Validators.required)
        });
      break;
      case 'question':  // formulario de pregunta.
        let correo      = "";
        let name        = "";
        let phone       = "";
        if(this.cuser != null){
            correo      = this.cuser.username;
            name        = this.cuser.name;
            phone       = this.cuser.telefono;
        }
        this.formQuestion = new FormGroup({
            fcorreo:        new FormControl(correo,[Validators.required, Validators.email]),
            fname:          new FormControl(name,[Validators.required]),
            fphone:         new FormControl(phone,[Validators.required]),
            fmessage:       new FormControl('',[Validators.required])
        });
      break;
    }
  }

  /**
   * @description   Metodo usado para procesar el guardado de informacion en usados detalle.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         28-01-2020
   */
  onSubmit(){
    this.loading.emit(true);  // loading
    switch(this.data.dialog){
      case 'message':
        this.snackBar.open(
            'Enviado mensaje..',
            null,
            {duration:4000}
          );
        let body = {
            p_operacion:     'SENDMENSAJE',
            p_codigo:        this.data.codigo_venta,
            form_mensaje:   {
                correo:     this.formQuestion.get('fcorreo').value,
                nombre:     this.formQuestion.get('fname').value,
                telefono:   this.formQuestion.get('fphone').value,
                mensaje:    this.formQuestion.get('fmessage').value
            }
        }
        // console.log(body);
        this.WebApiService.putRequest(AppComponent.urlService,body,{
            _p_action: '_usadodetalle'
        })
        .subscribe( // OK
          data=>{
            this.snackBar.open(
              'Mensaje enviado',
              null,
              {duration:4000}
            );
            this.loading.emit(false);
            this.closeDialog.emit();
          },
          error=>{ // ERROR
            console.log(error);
            this.snackBar.open(
              'Error al enviar mensaje',
              null,
              {duration:4000}
            )
            this.loading.emit(false);
            this.closeDialog.emit();
          }
        );
      break;
    }
  }

  // ------------------------ FORMULARIO DE VENDIDO y ELIMINADO --------------------------
  onSubmitSold(){
    event.preventDefault();
    event.stopPropagation();
    if(this.formSold.get('fparametro').value == 6 && (this.detalle == '' || this.detalle == null) ){
      swal.fire({
        title: '',
        text: "Completa la información solicitada.",
        icon: null
      })
    }else{
      if(this.formSold.valid){
        this.loading.emit(true);
        let body = {
          p_operacion: 'INSERTVENDIDO',
          venta_codigo: this.data.codigo_venta,
          baja_razon: 'Vendido',
          parametro_codigo: this.formSold.get('fparametro').value,
          baja_detalle: this.detalle
        }
        this.WebApiService.putRequest(AppComponent.urlService,body,{
          _p_action:'_getClasificados'
        })
        .subscribe(
          data=>{
            this.loading.emit(false);
            this.snackBar.open('Información actualizada',null,{
              duration: 4000
            });
            this.closeDialog.emit();
          },
          error=>{
             this.loading.emit(false);
            this.snackBar.open('Información actualizada',null,{
              duration: 4000
            });
            this.closeDialog.emit();
          }
        )
      }else{
        swal.fire({
          title: '',
          text: "Completa la información solicitada.",
          icon: null
        })
      }
    }
  }
  onSubmitDelete(){
    event.stopPropagation();
    event.preventDefault();
    if(this.formDelete.get('fparametro').value == 8 && (this.detalle == '' || this.detalle == null) ){
      swal.fire({
        title: '',
        text: "Completa la información solicitada.",
        icon: null
      })
    }else{
      if(this.formDelete.valid){
        this.loading.emit(true);
        let body = {
          p_operacion: 'INSERTELIMINADO',
          venta_codigo: this.data.codigo_venta,
          baja_razon: 'Eliminado',
          parametro_codigo: this.formDelete.get('fparametro').value,
          baja_detalle: this.detalle
        }

        this.WebApiService.putRequest(AppComponent.urlService,body,{
          _p_action:'_getClasificados'
        })
        .subscribe(
          data=>{
            this.loading.emit(false);
            this.snackBar.open('Información actualizada',null,{
              duration: 4000
            });
            this.closeDialog.emit();
          },
          error=>{
            this.loading.emit(false);
            this.snackBar.open('Información actualizada',null,{
              duration:4000
            });
             this.closeDialog.emit();
          }
        )
      }else{
        swal.fire({
          title: '',
          text: "Completa la información solicitada.",
          icon: null
        })
      }
    }
  }
  setOption(event){
    if(this.view == 'sold'){  // vendido
      if(event.value == 6){
        this.viewAnotherWay = true;
      }else{
        this.viewAnotherWay = false;
      }
    }else if(this.view == 'delete'){
      if(event.value == 9){ //vendido
        this.back = true;
        this.closeDialog.emit('sold');
        this.viewAnotherWay = false;
      }else if(event.value == 8){  // inconformidad
        this.viewAnotherWay = true;
      }else{
        this.viewAnotherWay = false;
        this.back = false;
        this.view = 'delete';
      }
    }
  }
  setDetalle(event){
    this.detalle = event.target.value;
  }

  backOption(){
    event.stopPropagation();
    event.preventDefault();
    this.closeDialog.emit('delete');
  }

  btnClose(){
    event.stopPropagation();
    event.preventDefault();
    this.closeDialog.emit(false);
  }
  // ------------------------ /FORMULARIO DE VENDIDO Y ELIMINADO --------------------------
}

