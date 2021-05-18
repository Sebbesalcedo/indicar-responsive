import { Component, OnInit , EventEmitter, Output,Inject } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
 
import { AuthenticationService } from '../servicios/AuthenticationService.servicio';
import {EncabezadoComponent} from './encabezado.component';

import {
    FormBuilder,
    FormGroup,   
    FormControl,    
    Validators
} from '@angular/forms'
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-registro',
    templateUrl: '../templates/registro.template.html',
    styleUrls: ['../css/registro.css']
})
 
export class RegistroComponent implements OnInit {
    success:string='';
    error:string='';
    public customPatterns = {'0': { pattern: new RegExp('\[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]')}};
    //FORM
    @Output() myEvent = new EventEmitter<string>();
    registroForm: FormGroup;
    //FILTROS
    modelo = {
       // nombres: '',
       // apellidos: '',    
        
        nombre1: '',
        nombre2: '',
        apellido1: '',    
        apellido2: '',    

        //fnacimiento: '',
        email:'',
        password:'',
        confirmarpassword:'',
        telefono: '',
        tipocliente:'01'
    };
    public mask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

    password_type: string = 'password';

    togglePasswordMode() {   
       this.password_type = this.password_type === 'text' ? 'password' : 'text';
    }

    loading=false;
    validEmail=true;

    constructor( private fb: FormBuilder,
        private promiseService: WebApiPromiseService,
        private authenticationService: AuthenticationService,
        @Inject(EncabezadoComponent) private parent: EncabezadoComponent,
        private route: ActivatedRoute,
        private router: Router) { }

      ngOnInit() {
        this.registroForm= this.fb.group({
            nombre1: new FormControl('', [
                Validators.required,
                //Validators.minLength(1),
                Validators.maxLength(100)
            ]),
            apellido1: new FormControl('', [
                Validators.required,
                Validators.maxLength(100)
            ]),
            nombre2: new FormControl('', [
                //Validators.required,
                //Validators.minLength(1),
                Validators.maxLength(100)
            ]),
            apellido2: new FormControl('', [
                //Validators.required,
                Validators.maxLength(100)
            ]),
            razonsocial: new FormControl('', [
                Validators.required,
                Validators.maxLength(100)
            ]),

            nit: new FormControl('', [
                Validators.required,
                Validators.maxLength(100)
            ]),

             direccion: new FormControl('', [
                Validators.required,
                Validators.maxLength(100)
            ]),
            
           /* nombres: new FormControl('', [
                Validators.required,
                //Validators.minLength(1),
                Validators.maxLength(100)
            ]),
            apellidos: new FormControl('', [
                Validators.required,
                Validators.maxLength(100)
            ]),*/
           /* fnacimiento: new FormControl('', [
                Validators.required
              ]),*/
            email: new FormControl('', [
              Validators.required,
              Validators.email
              //Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
            ]),
            password: new FormControl('', [
                Validators.required
            ]),
            confirmarpassword: new FormControl('', [
                Validators.required
            ]),
            celular: new FormControl('', [
                Validators.required
            ])  ,
            acepto: new FormControl('', [
                Validators.required
            ])  ,
            tipocliente: new FormControl('01', [
                Validators.required
            ]) 
            
          });
      }
      onValidate(){
         
        this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
            AppComponent.urlservicio + '?_p_action=_putCuentaConfigurar&p_validacion=EMAIL',
            {
                p_email: this.registroForm.controls.email.value
            }
        )
            .then(result => {
               // this.lovCaja = result.datos;
               //console.log("RESULT",result);
               //alert(result.cantidad)
               if(result.cantidad>0){
                    this.validEmail=false;
               }else{
                    this.validEmail=true;                   
               }     
            })
            .catch(error => {
                console.log(error)
                alert(error._body);
                this.validEmail=false;
            });
      }

      putUser(){
            //alert('aaaaaa')
           //  alert(this.registroForm.controls["tipocliente"].value);
            if(this.registroForm.controls["tipocliente"].value=="01"){//NATURAL               
                this.registroForm.controls["nombre1"].setValidators( [Validators.required,Validators.maxLength(100)]);
                this.registroForm.controls["apellido1"].setValidators( [Validators.required,Validators.maxLength(100)]);            
                this.registroForm.controls["nombre1"].updateValueAndValidity();
                this.registroForm.controls["apellido1"].updateValueAndValidity();
                this.registroForm.controls["razonsocial"].setValidators( [Validators.maxLength(100)]);
                this.registroForm.controls["razonsocial"].setValue('');    
                this.registroForm.controls["razonsocial"].clearValidators();             
                this.registroForm.controls["razonsocial"].updateValueAndValidity();                                   
                this.registroForm.controls["nit"].clearValidators();             
                this.registroForm.controls["nit"].updateValueAndValidity();                                   
                this.registroForm.controls["direccion"].clearValidators();             
                this.registroForm.controls["direccion"].updateValueAndValidity();                                                  
            }else{//EMPRESA    
                this.registroForm.controls["nombre1"].clearValidators();             
                this.registroForm.controls["nombre1"].updateValueAndValidity();             
                this.registroForm.controls["nombre2"].clearValidators();             
                this.registroForm.controls["nombre2"].updateValueAndValidity();             
                this.registroForm.controls["apellido1"].clearValidators();             
                this.registroForm.controls["apellido1"].updateValueAndValidity();             
                this.registroForm.controls["apellido2"].clearValidators();             
                this.registroForm.controls["apellido2"].updateValueAndValidity();                             
                this.registroForm.controls["nombre1"].setValue('');
                this.registroForm.controls["apellido1"].setValue('');     
                this.registroForm.controls["nombre2"].setValue('');
                this.registroForm.controls["apellido2"].setValue('');              
            }
            if(!this.registroForm.valid){
                this.error='Errores en el Formulario';            
                window.scrollTo(0, 0);
                return;
            }
            this.registroForm.get("celular").setValue(this.registroForm.get("celular").value.replace(/\D+/g, ''));        
            this.promiseService.createService(
                AppComponent.urlservicio + '?_p_action=_putCuentaConfigurar',
                this.registroForm.getRawValue()
            )
                .then(result => {                
                    this.success = 'Datos Actualizados Correctamente';
                    window.scrollTo(0, 0);                
                    this.authenticationService.login(result.datos[0].cliente_correo, result.pass)
                    .subscribe(result => {                    
                        if (result === true) {                        
                            this.parent.setLogin("LOGINOK");
                            this.myEvent.emit('LOGINOK');
                            // login successful
                            this.router.navigate(['/']);
                        } else {
                            // login failed                        
                            this.error = 'Username or password is incorrect';                        
                        }
                    },err=>{                    
                        this.error = err+'';                      
                    });


                })
                .catch(error => {                
                    this.error = error._body;                
                    window.scrollTo(0, 0)
                });
      }

      onSubmit(value: string) {
          
        
        this.success='';
        this.error='';
        if(this.registroForm.get("acepto").value!=true){
            this.error='No se Acepto el Aviso de privacidad, las politicas de tratamiento de datos y  publicación de clasificados';            
            window.scrollTo(0, 0);
            return; 
        }
        

        if( this.registroForm.get("password").value!=this.registroForm.get("confirmarpassword").value){
            this.error='Confirmacion de Password no es Igual al Password';            
            window.scrollTo(0, 0);
            return;
        }
        this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
            AppComponent.urlservicio + '?_p_action=_putCuentaConfigurar&p_validacion=EMAIL',
            {
                p_email: this.registroForm.controls.email.value
            }
        ).then(result => {            
            // this.lovCaja = result.datos;
            if(result.cantidad>0){
                 this.validEmail=false;
                 window.scrollTo(0, 0);
            }else{
                 this.validEmail=true;   
                 this.putUser();                
            }     
         })
         .catch(error => {            
             alert(error._body);
             this.validEmail=false;
         });;   
        //alert('aaaaaa')
        /*
        if(this.registroForm.controls["tipocliente"].value=="01"){//NATURAL
            this.registroForm.controls["nombre1"].setValidators( [Validators.required,Validators.maxLength(100)]);
            this.registroForm.controls["apellido1"].setValidators( [Validators.required,Validators.maxLength(100)]);
            this.registroForm.controls["nombre1"].updateValueAndValidity();
            this.registroForm.controls["apellido1"].updateValueAndValidity();
            this.registroForm.controls["razonsocial"].setValidators( [Validators.maxLength(100)]);
            this.registroForm.controls["razonsocial"].setValue('');          
            this.registroForm.controls["razonsocial"].updateValueAndValidity();  
            this.registroForm.controls["razonsocial"].setValidators( [Validators.maxLength(100)]);
            this.registroForm.controls["razonsocial"].setValue('');          
            this.registroForm.controls["razonsocial"].updateValueAndValidity();  
            
        }else{//EMPRESA
            this.registroForm.controls["nombre1"].setValue('');
            this.registroForm.controls["apellido1"].setValue('');            

            this.registroForm.controls["razonsocial"].setValidators( [Validators.required,Validators.maxLength(100)]);            
            this.registroForm.controls["nombre1"].setValidators( [Validators.maxLength(100)]);
            this.registroForm.controls["apellido1"].setValidators( [Validators.maxLength(100)]);
            this.registroForm.controls["nombre1"].updateValueAndValidity();
            this.registroForm.controls["apellido1"].updateValueAndValidity();    

        }

        if(!this.registroForm.valid){
            this.error='Errores en el Formulario';            
            window.scrollTo(0, 0);
            return;
        }
*/
     
      
       /* this.registroForm.get("celular").setValue(this.registroForm.get("celular").value.replace(/\D+/g, ''));
        
        this.promiseService.createService(
            AppComponent.urlservicio + '?_p_action=_putCuentaConfigurar',
            this.registroForm.getRawValue()

        )
            .then(result => {               
               if(result.cantidad>0){
                    this.validEmail=false;
                    window.scrollTo(0, 0);
               }else{
                    this.validEmail=true;   
                    this.putUser();                
               }     
            })
            .catch(error => {
                console.log(error);
                alert(error._body);
                this.validEmail=false;
            });*/

    }

}