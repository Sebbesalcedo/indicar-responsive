import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
// DEPENDENCIAS
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { MatSnackBar } from '@angular/material';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pqrs',
  templateUrl: './pqrs.component.html',
  styleUrls: ['./pqrs.component.css']
})
export class PqrsComponent implements OnInit {

  public loading:boolean  = false;
  cuser:any               = null;
  // formulario pqrs
  formPqrs:any;
  emailInvalid:boolean    = false;

  constructor(
    private WebApiService:WebApiService,
    private router:Router,
    private snackBar:MatSnackBar
  ){ }

  ngOnInit() {
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    this.initForms();
  }

  initForms(){
    let name    = "";
    let correo  = "";
    if(this.cuser != null){
      name    = this.cuser.name;
      correo  = this.cuser.username;
    }
    this.formPqrs = new FormGroup({
      fname:      new FormControl(name,[Validators.required,Validators.minLength(4)]),
      fcorreo:    new FormControl(correo,[Validators.required, Validators.email,Validators.minLength(6)]),
      ftipo:      new FormControl('',[Validators.required]),
      ftexto:     new FormControl('',[Validators.required,Validators.minLength(5)])
    });
  }

  setFieldError(fieldname:string){
    let field = document.querySelector("[formcontrolname='"+fieldname+"']");
    let parent;
    parent =  field.parentNode.parentNode.parentNode.parentNode;
    parent.classList.add('ng-invalid','mat-form-field-invalid');
    return false;
  }
  onSubmit(){
    // envio informacion a la base de datos y al correo de serviciocliente
    let form = this.formPqrs.value;
    if(form.name == ""){
      this.formPqrs.controls['fname'].setErrors({'incorrect': true});
      this.setFieldError('fname');
    }
    if(form.fcorreo == ""){
      this.formPqrs.controls['fcorreo'].setErrors({'incorrect': true});
      this.setFieldError('fcorreo');
    }
    if(form.ftipo == ""){
      this.formPqrs.controls['ftipo'].setErrors({'incorrect': true});
      this.setFieldError('ftipo');
    }
    if(form.ftexto == ""){
      this.formPqrs.controls['ftexto'].setErrors({'incorrect': true});
      this.setFieldError('ftexto');
    }

    if(!this.formPqrs.valid){
      swal.fire({
        title:'',
        icon:null,
        text: 'Complete la información correctamente'
      });
    }else if(this.emailInvalid){
      swal.fire({
        title:'',
        icon:null,
        text: 'Complete la información correctamente'
      });
    }else{
      //console.log('envio');
      this.snackBar.open('Enviando su solicitud...',null,{
        duration: 10000
      });

      let inputFile;
      inputFile = document.querySelector('#attach_file');

      this.formPqrs.controls['fname'].setValue('');
      this.formPqrs.controls['fcorreo'].setValue('');
      this.formPqrs.controls['ftipo'].setValue('');
      this.formPqrs.controls['ftexto'].setValue('');

      this.formPqrs.controls['fname'].setErrors(null);
      this.formPqrs.controls['fcorreo'].setErrors(null);
      this.formPqrs.controls['ftipo'].setErrors(null);
      this.formPqrs.controls['ftexto'].setErrors(null);

      this.formPqrs.updateValueAndValidity();

      // // limpio validaciones
      // this.formPqrs.controls['fname'].clearValidators();
      // this.formPqrs.controls['fcorreo'].clearValidators();
      // this.formPqrs.controls['ftipo'].clearValidators();
      // this.formPqrs.controls['ftexto'].clearValidators();

      // limpio valores
      // this.formPqrs.controls['fname'].setValue('');
      // this.formPqrs.controls['fcorreo'].setValue('');
      // this.formPqrs.controls['ftipo'].setValue('');
      // this.formPqrs.controls['ftexto'].setValue('');



      let body;
      if(typeof(inputFile.files[0]) == 'object'){ // envio pqrs con fichero
        this.loading = true;
        // formulario
        let form = this.formPqrs.value;
        // archivo
        let fichero = inputFile.files[0];
        let fileName = inputFile.files[0].name;

        this.processFile(fichero,fileName)
        .then(data=>{
          data['form'] = form;
          let body = data;
          this.WebApiService.putRequest(AppComponent.urlService,body,{
            _p_action: '_pqrs'
          })
          .subscribe(
            data=>{
              this.ngOnInit();
              this.loading = false;
              this.snackBar.open('Información enviada exitosamente, sera atendida por nuestro equipo lo antes posible.',null,{
                duration: 9000
              });
              // limpio validaciones
              this.formPqrs.controls['fname'].clearValidators();
              this.formPqrs.controls['fcorreo'].clearValidators();
              this.formPqrs.controls['ftipo'].clearValidators();
              this.formPqrs.controls['ftexto'].clearValidators();

              // limpio valores
              this.formPqrs.controls['fname'].setValue('');
              this.formPqrs.controls['fcorreo'].setValue('');
              this.formPqrs.controls['ftipo'].setValue('');
              this.formPqrs.controls['ftexto'].setValue('');
              // remuevo fichero cargado.
              let btn;
              btn = document.querySelector('#remove_file_btn');
              btn.click();
            },
            error=>{
              this.snackBar.open('Ocurrio un error',null,{
                duration: 4000
              });
              this.loading = false;
            }
          )
        })
        .catch(error=>{
          console.log(error);
          this.loading = false;
          this.snackBar.open('Ocurrio un error',null,{
            duration: 4000
          });
        })
      }else{ // sin fichero
        this.loading = true;
        body = {
          form: this.formPqrs.value
        };
        this.WebApiService.postRequest(AppComponent.urlService, body,{
          _p_action: '_pqrs'
        })
        .subscribe(
          data=>{
            if(data.success == true){
              this.snackBar.open('Información enviada exitosamente, sera atendida por nuestro equipo lo antes posible.',null,{
                duration: 9000
              });
              // limpio validaciones
              this.formPqrs.controls['fname'].clearValidators();
              this.formPqrs.controls['fcorreo'].clearValidators();
              this.formPqrs.controls['ftipo'].clearValidators();
              this.formPqrs.controls['ftexto'].clearValidators();

              // limpio valores
              this.formPqrs.controls['fname'].setValue('');
              this.formPqrs.controls['fcorreo'].setValue('');
              this.formPqrs.controls['ftipo'].setValue('');
              this.formPqrs.controls['ftexto'].setValue('');

              this.loading = false;
            }else{
              this.loading = false;
              this.snackBar.open('Ocurrio un error',null,{
                duration: 4000
              });
            }
          },
          error=>{
            this.loading = false;
            this.snackBar.open('Ocurrio un error',null,{
              duration: 3000
            });
          }
        );
      }
    }
  }
  /**
   * @author      Daniel Bolivar
   * @description Procesamiento de ficheros.
   * @return      Object. (Promise)
   */
  processFile(file,fileName){
    return new Promise((resolve,reject)=>{
      var form = {};
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = result=>{
        var res;
        res = result.target;
        form['file'] = res.result;
        form['fileName'] = fileName;
        resolve(form);
      }
      reader.onerror = error=>{
        reject(error);
      }
    });
  }
  /**
   * @description adjuntar archivos.
   * @param event
   */
  attachFile(){
    event.stopPropagation();
    event.preventDefault();
    let inputFile;
    inputFile = document.querySelector('#attach_file');
    inputFile.click();
  }
  handleLabel(event){
    let ctx = document.querySelector('.attach_file_content');
    let sec;
    sec = document.querySelector('.files_content');
    var input = event.target;
    if(event.target.files.length > 0){
      //chequeo tamanio
      if(event.target.files[0].size > 4194304){
        input.value = "";
        this.snackBar.open('Fichero excede el tamaño máximo.',null,{
          duration: 9000
        });
        return false;
      }
      // chequeo de extensiones
      let filename = event.target.files[0].name;
      let split = filename.split('.');
      let ext = split[split.length-1];
      ext = ext.toLowerCase();
      let extValid = ['jpg','jfif','png','jpeg','doc','docx','xls','xlsx','pdf','svg'];
      if(extValid.indexOf(ext) == -1){
        input.value = "";
        this.snackBar.open('Extensión no valida.',null,{
          duration: 9000
        });
        return false;
      }
      sec.innerHTML = "<span>"+event.target.files[0].name+"</span><button id='remove_file_btn'>&times;</button>";
      sec.classList.remove('noview');

      let btn;
      btn = document.querySelector('#remove_file_btn');
      btn.addEventListener('click',function(){
        sec.classList.add('noview');
        input.value = '';
      })
    }else{
      sec.classList.add('noview');
      ctx.classList.remove('noview');
    }
  }

  /**
   * @description   Metodo usado para chequear el email existe en la base de dato de indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @return        true | false
   */
  checkEmail(event){
    this.validateEmailSintaxisPqrs(event);
  }

  /**
   * @description   Metodo usado para verificar las sintaxis de los correos
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         04-02-2020
   * @return        true | false
   */
  validateEmailSintaxisPqrs(e){
    let fieldEmail;
    fieldEmail = document.querySelector('#mailPqrs');
    let valid = this.validateEmailSintaxis(e.target.value);
    if(valid){
      fieldEmail.classList.remove('mat-form-field-invalid');
      this.emailInvalid = false;
    }else{
      fieldEmail.classList.add('mat-form-field-invalid');
      this.emailInvalid = true;
    }
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

}
