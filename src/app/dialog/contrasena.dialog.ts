import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { AppComponent } from '../app.component';
import swal from 'sweetalert2';

import {
  FormBuilder,  
  FormControl,  
  Validators
} from '@angular/forms'
 @Component({
  selector: 'contrasena-add.dialog',
  templateUrl: './contrasena.dialog.html'
})

export class ContrasenaDialogComponent {
  form;
  constructor( 
    private fb: FormBuilder,
    private promiseService: WebApiPromiseService,
    public dialogRef: MatDialogRef<ContrasenaDialogComponent>
   ) { }
  init_form(){
    this.form = this.fb.group({        
      password: new FormControl('', [
          Validators.required
      ]),
      confirmarpassword: new FormControl('', [
          Validators.required
      ])
    });
  }
  ngOnInit() {
    this.init_form();
    /*
    this.currentuser = JSON.parse(localStorage.getItem("currentUser")); 
    if( this.currentuser.tipoasesor=="ASESOR1"||this.currentuser.tipoasesor=="ASESOR2"){
        this.isAdmin=true;
    }  
    //console.log("CUSER",this.currentuser)     ;
    this.sendRequest();
    this.displayedColumns = this.columnNames.map(x => x.id);
    */
  }
  doUpdate(){
    if(this.form.get("password").value!=this.form.get("confirmarpassword").value){
      swal(
        AppComponent.tituloalertas,
        'Password y Confirmacion debe ser Iguales ',
        'info'
      );        
      return;
    }
    this.promiseService.updateService(
      AppComponent.urlservicio + '?_p_action=_cuentaconfigurar&p_operacion=updatepassword',
      {
          form: this.form.value ,
          p_operacion : 'updatepassword'
      }          
  )
      .then(result => {
          swal(
              AppComponent.tituloalertas,
              'Contraseña Actualizada Correctamente',
              'success'
          );   
          this.dialogRef.close();                             
      })
      .catch(error => {                          
          alert(error._body);            
      });
  }
}
