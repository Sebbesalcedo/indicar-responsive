import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { AppComponent } from '../app.component';
import swal from 'sweetalert2';

import { Router } from '@angular/router';
import {AuthenticationService} from '../servicios/AuthenticationService.servicio';
import {EncabezadoComponent} from '../componentes/encabezado.component';

import {
  FormBuilder,  
  FormControl,  
  Validators
} from '@angular/forms'
 @Component({
  selector: 'email-add.dialog',
  templateUrl: './email.dialog.html'
})

export class EmailDialogComponent {
  form;
  constructor( 
    private fb: FormBuilder,
    private promiseService: WebApiPromiseService,
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    private authenticationService: AuthenticationService,
    public router : Router,
    @Inject(EncabezadoComponent) private parent: EncabezadoComponent
   ) { }
  init_form(){
    this.form = this.fb.group({        
      email: new FormControl('', [
          Validators.required
        ]),
      emailConfirm: new FormControl('', [
        Validators.required
        ])
    })
  }
  ngOnInit() {
    this.init_form();
  }
  doUpdate(){
    if(this.form.get("email").value !== this.form.get("emailConfirm").value){
      swal(
        AppComponent.tituloalertas,
        'Los emails no coinciden, por favor compruebe que sean iguales',
        'error'
      );        
      return;
    }
    this.promiseService.updateService(
      AppComponent.urlservicio + '?_p_action=_cuentaconfigurar&p_operacion=updateemail',
      {
          form: this.form.value ,
          p_operacion : 'updateemail'
      }          
  )
      .then(result => {
        //   this.theemail = this.form.get("email").value;
          swal(
              AppComponent.tituloalertas,
              'Email Actualizado Correctamente, deberá iniciar sesion nuevamente',
              'success'
          );   
          this.dialogRef.close({ data: 'data' });
        //   this.authenticationService.logout();
        //   this.router.navigate(['/login']);
        //   localStorage.removeItem('currentUser');
        //   this.parent.isLogged=false;     
        //   this.parent.nameUser='';
        //  this.parent.logout();                
      })
      .catch(error => {                          
          alert(error._body);            
      });
  }
}
