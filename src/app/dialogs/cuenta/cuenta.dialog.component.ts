import { Component, Inject, Output, EventEmitter } from '@angular/core';
// dependencias
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import swal from 'sweetalert2';

// SERVICIOS
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AuthenticationService } from 'src/app/servicios/authentication-service.service';
import { AppComponent } from 'src/app/app.component';

export interface DialogData {
  login: boolean;
}

@Component({
  selector: 'cuenta-dialog',
  templateUrl: 'cuenta.dialog.html',
})

export class CuentaDialog{
  // VARIABLES
  formCorreo:any;
  formPassword:any;
  formPhone:any;
  formAsesor:any;
  hide:boolean            = true;
  hideConfirm:boolean     = true;
  viewCorreo:boolean      = false;
  viewPass:boolean        = false;
  viewPhone:boolean       = false;
  viewAsesor:boolean      = false;
  emailInvalid:string     = '';
  opt;

  // mask
  public maskPhone = "(000) 000 0000";

  // OUTPUT
  @Output() loading = new EventEmitter();
  @Output() closeDialog = new EventEmitter();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private WebApiService:WebApiService,
    private snackBar:MatSnackBar,
    private AutheticationService:AuthenticationService
  ){
    if(this.data.dialog == 'asesor'){
      if(this.data.asesor_codigo == null){
        this.opt = 'Agregar';
      }else{
        this.opt = 'Editar';
      }
    }else if(this.data.dialog == 'phone'){
      if(this.data.telefono_codigo == null){
        this.opt = 'Agregar';
      }else{
        this.opt = 'Editar';
      }
    }
    this.initForms();
  }
  /**
   * @description   Metodo usado para iniciar el formulario correspondiente correo o password.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         23-12-2019
   */
  initForms(){
    if(this.data.dialog == 'correo'){
      this.viewCorreo = true;
      this.formCorreo = new FormGroup({
        fcorreo:    new FormControl('',[Validators.required, Validators.email, Validators.maxLength(150)]),
        fccorreo:   new FormControl('',[Validators.required, Validators.email, Validators.maxLength(150)])
      });
    }else if(this.data.dialog =='contraseña'){
      this.viewPass = true;
      this.formPassword = new FormGroup({
        fpass:    new FormControl('',[Validators.required]),
        fcpass:   new FormControl('',[Validators.required])
      });
    }else if(this.data.dialog == 'phone'){
      this.viewPhone = true;
      this.formPhone = new FormGroup({
        fphone:    new FormControl('',[Validators.required])
      });
      if(this.data.telefono_codigo!= null){
        this.formPhone.get('fphone').setValue(this.data.telefono_numero);
      }
    }else if(this.data.dialog == 'asesor'){
      this.viewAsesor = true;
      this.formAsesor = new FormGroup({
        fasesor:   new FormControl('',[Validators.required])
      });
      if(this.data.asesor_codigo!= null){
        this.formAsesor.get('fasesor').setValue(this.data.asesor_nombre);
      }
    }
  }

  /**
   * @description   Metodo usado para chequear el email existe en la base de dato de indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         23-12-2019
   */
  checkEmail(event){
    this.emailInvalid = '';
    if(this.validateEmailSintaxisField(event)){
      if(event.target.value != ''){
        this.AutheticationService.checkEmail(event.target.value)
        .subscribe(
          data =>{
            let datos;
            datos = data;
            if(datos.cantidad == 1){
              this.emailInvalid = "E-mail ya registrado por favor use otro e-mail.";
            }
          },
          error=>{
            console.log(error);
          }
        )
      }
    }
  }

  /**
   * @description   Metodo usado para actualizar correo o contraseña de usuario en indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         23-12-2019
   */
  doUpdate(){
    // ACTUALIZACION DE CORREO
    if(this.data.dialog == 'correo'){
      if(this.formCorreo.valid){
        this.loading.emit(true);  // loading
        if(this.validateEmailSintaxis(this.formCorreo.get('fcorreo').value)){
          if(this.formCorreo.get("fcorreo").value!=this.formCorreo.get("fccorreo").value){ // CORREO NO SON IGUALES
            swal.fire({
              title:'',
              text: 'Los correos deben coincidir',
              icon: null
            });
            this.loading.emit(false);
          }else{ // ACTUALIZAR CORREO
            if(this.emailInvalid != ''){
              swal.fire({
                title:'',
                text: 'El e-mail ya se encuentra registrado.',
                icon: null
              });
              this.loading.emit(false);
              return false;
            }else{
              let body = {
                form: {
                  email: this.formCorreo.get('fcorreo').value,
                  emailConfirm: this.formCorreo.get('fccorreo').value
                }
              }
              this.WebApiService.putRequest(AppComponent.urlService,body,{
                _p_action:'_cuentaconfigurar',
                p_operacion:'updateemail'
              })
              .subscribe( // OK
                data=>{
                  this.snackBar.open(
                    'Información actualizada',
                    'Aceptar',
                    {duration:4000}
                  );
                  this.closeDialog.emit();
                },
                error=>{ // ERROR
                  // console.log(error);
                  this.snackBar.open(
                    'Error al actualizar',
                    'Aceptar',
                    {duration:4000}
                  )
                  this.closeDialog.emit();
                }
              )
            }
          }
        }else{
          swal.fire({
            title:'',
            text: 'Ingrese un correo valido',
            icon: null
          });
          this.loading.emit(false);
        }
      }else{
        swal.fire({
          title:'',
          text: 'Complete la información solicitada',
          icon: null
        });
        this.loading.emit(false);
      }
    }else{
      if(this.formPassword.valid){
        if(this.formPassword.get("fpass").value!=this.formPassword.get("fcpass").value){ // CONTRASENAS NO COINCIDEN
          swal.fire({
            title:'',
            text: 'Contraseña y confirmación deben ser iguales ',
            icon: null
          });
          this.loading.emit(false);
        }else{
          // ACTUALIZANDO CONTRASENA
          this.loading.emit(true);
          let body = {
            form: {
              password: this.formPassword.get('fpass').value,
              confirmarpassword: this.formPassword.get('fcpass').value
            }
          }
          this.WebApiService.putRequest(AppComponent.urlService,body,{
            _p_action:'_cuentaconfigurar',
            p_operacion : 'updatepassword',
          })
          .subscribe( // OK
            data=>{
              if(data.success){
                this.snackBar.open(
                  'Información actualizada',
                  'Aceptar',
                  {duration:4000}
                )
              }
              this.closeDialog.emit();
            },
            error=>{ // ERROR
              // console.log(error);
              this.snackBar.open(
                'Error al actualizar',
                'Aceptar',
                {duration:4000}
              )
              this.closeDialog.emit();
            }
          )
        }
      }else{
        swal.fire({
          title:'',
          text: 'Complete la información solicitada',
          icon: null
        });
        this.loading.emit(false);
      }
    }
  }


  /**
   * @description   Metodo usado para verificar las sintaxis de los correos
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         04-02-2020
   * @return        true | false
   */
  validateEmailSintaxisField(e){
    let fieldEmail;
    fieldEmail = document.querySelector('#change_mail');
    let valid = this.validateEmailSintaxis(e.target.value);
    if(valid){
      fieldEmail.classList.remove('mat-form-field-invalid');
    }else{
      fieldEmail.classList.add('mat-form-field-invalid');
    }
    return valid;
  }
  /**
   * @description   Metodo usado para verificar las sintaxis de los correos
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         04-02-2020
   * @return        true | false
   */
  validateEmailSintaxis(email){
    let valid;
    if(email.search('@')!= -1){
      let dominio = email.split('@');
      let dotPosition = dominio[1].indexOf('.');
      if(dotPosition == -1){
        valid = false;
      }else{
        valid = dominio[1].substr(dotPosition+1).length > 1;
      }
    }else{
      valid = false;
    }
    return valid;
  }


  onSubmit(){
    this.loading.emit(true);  // loading
    if(this.data.dialog == 'phone'){
      // INSERSION DE TELEFONO
      if(this.data.telefono_codigo == null){
        let body = {
          telefono_numero: this.formPhone.get('fphone').value
        }
        this.WebApiService.postRequest(AppComponent.urlService,body,{
          _p_action:'_clientetelefono'
        })
        .subscribe( // OK
          data=>{
            this.snackBar.open(
              'Información actualizada',
              'Aceptar',
              {duration:4000}
            );
            this.closeDialog.emit();
          },
          error=>{ // ERROR
            console.log(error);
            this.snackBar.open(
              'Error al actualizar',
              'Aceptar',
              {duration:4000}
            )
            this.closeDialog.emit();
          }
        );   
      }else{  // EDICION DE TELEFONO
        let body = {
          telefono_numero: this.formPhone.get('fphone').value,
          telefono_codigo :this.data.telefono_codigo
        }
        this.WebApiService.putRequest(AppComponent.urlService,body,{
          _p_action:'_clientetelefono'
        })
        .subscribe(
          data=>{
            console.log(data);
            this.snackBar.open(
              'Información actualizada',
              'Aceptar',
              {duration:4000}
            );
            this.closeDialog.emit();
          },
          error=>{
            console.log(error);
            this.snackBar.open(
              'Error al actualizar',
              'Aceptar',
              {duration:4000}
            )
            this.closeDialog.emit();
          }
        );
      }
    }else if(this.data.dialog == 'asesor'){
      // INSERSION DE ASESOR
      if(this.data.asesor_codigo == null){
        let body = {
          asesor_nombre: this.formAsesor.get('fasesor').value
        }
        this.WebApiService.postRequest(AppComponent.urlService,body,{
          _p_action:'_clienteasesor'
        })
        .subscribe( // OK
          data=>{
            this.snackBar.open(
              'Información actualizada',
              'Aceptar',
              {duration:4000}
            );
            this.closeDialog.emit();
          },
          error=>{ // ERROR
            console.log(error);
            this.snackBar.open(
              'Error al actualizar',
              'Aceptar',
              {duration:4000}
            )
            this.closeDialog.emit();
          }
        );
      }else{  //EDICION ASESOR.
        let body = {
          asesor_codigo:this.data.asesor_codigo,
          asesor_nombre: this.formAsesor.get('fasesor').value
        }
        this.WebApiService.putRequest(AppComponent.urlService,body,{
          _p_action:'_clienteasesor'
        })
        .subscribe(
          data=>{
            console.log(data);
            this.snackBar.open(
              'Información actualizada',
              'Aceptar',
              {duration:4000}
            );
            this.closeDialog.emit();
          },
          error=>{
            console.log(error);
            this.snackBar.open(
              'Error al actualizar',
              'Aceptar',
              {duration:4000}
            )
            this.closeDialog.emit();
          }
        );
      }
    }
  }
}
