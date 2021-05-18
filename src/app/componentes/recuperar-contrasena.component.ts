import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
import { AuthenticationService } from '../servicios/AuthenticationService.servicio';
import {EncabezadoComponent} from './encabezado.component';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import swal from 'sweetalert2';
@Component({
    selector: 'app-contrasena',
    templateUrl: '../templates/recuperar-contrasena.template.html',
    styleUrls: ['../css/registro.css']
})
 
export class RecuperarContrasena implements OnInit {

    password_type: string = 'password';
    loading=false;
    //alerta
    private _success = new Subject<string>();
    private _error = new Subject<string>();

    staticAlertClosed = false;
    successMessage: string;
    errorMessage: string;
    form:any;

    togglePasswordMode() {   
       this.password_type = this.password_type === 'text' ? 'password' : 'text';
    }
    constructor(private fb: FormBuilder,
      private promiseService: WebApiPromiseService) { }

      ngOnInit() {
        //alerta
        setTimeout(() => this.staticAlertClosed = true, 20000);

        this._success.subscribe((message) => this.successMessage = message);
        debounceTime.call(this._success, 10000).subscribe(() => this.successMessage = null);

        this._error.subscribe((message) => this.errorMessage = message);
        debounceTime.call(this._error, 10000).subscribe(() => this.errorMessage = null);
        this.init_form();
      }

     //alerta
    public changeSuccessMessage() {
      this._success.next(`Consulta tu correo electrónico y confirma la solicitud para restablecer la contraseña`);
    }

    public changeErrorMessage() {
      this._error.next(`El correo no se encuntra registrado, intenta nuevamente`);
    }
    public init_form(){
      this.form = this.fb.group({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ])
      });
    }
    submit2() {               
      this.loading=true;
      this.promiseService.updateService(
          AppComponent.urlservicio + '?_p_action=_recuperarpsw',
          {
              form: this.form.value 
          }          
      )
          .then(result => {
              this.loading=false;              
              swal(
                  AppComponent.tituloalertas,
                  'Se envio un Email con las instrucciones para recuperar Acceso a INDICAR',
                  'info'
              );
             /* 
              //alert('aaaaaa')
              this.loading = false;
              this.router.navigate(['cuenta', {outlets: { 'cuenta-opcion': ['clasificado','P'] }}]);        
              if(result.datos!=undefined){
                  this.loading = false;
                  //console.log("DATAAAA",result.datos)
                  this.options = result.datos;                   
                  this.p_consecutivo =  this.options.codigo ; 
              }*/              
          })
          .catch(error => {       
              
              this.loading=false;                     
              alert(error._body);
              //console.log(error._body)
              //let config = new MatSnackBarConfig();
              //config.extraClasses = ['custom-class'];
              //this.snackBar.open(error._body, 'Error' ? 'Ok' : undefined, config);
          });

    }
}