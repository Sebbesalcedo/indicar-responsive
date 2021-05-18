import { Component, OnInit , EventEmitter, Input,Output,ViewChild , Inject } from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import swal from 'sweetalert2';
import { AuthenticationService } from '../servicios/AuthenticationService.servicio';
import { EncabezadoComponent } from './encabezado.component';
export interface Marca {
  value: string;
  viewValue: string;
}

export interface model {
  password: string;  
}

@Component({
  selector: 'app-valora',
  templateUrl: '../templates/cambiar-contrasena.template.html',
  styleUrls: ['../css/registro.css']
})

export class CambiarContrasenaComponent implements OnInit {
  model:model;
  loading=false;
  error;
  login;  
  password;
  password_type;
  hide;
  p_consecutivo:any=null;
  form:any;
  disable=true;
  @Output() myEvent = new EventEmitter<string>();
  constructor(private fb: FormBuilder,
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    @Inject(EncabezadoComponent) private parent: EncabezadoComponent,
        private router: Router) { }

  ngOnInit() {
    this.authenticationService.logout();
    this.init_form();
     //VALIDAR SI ESTA EN MODO MODIFICAR
    if (this.route.snapshot.paramMap.get('tk') != null) {
      this.p_consecutivo=this.route.snapshot.paramMap.get('tk');
      this.get_record(this.route.snapshot.paramMap.get('tk'))
    }else{                        
        this.p_consecutivo=null;
    //    this.sendRequest_change();
    }
  }
  public init_form(){
    this.form = this.fb.group({
      password: new FormControl('', [
          Validators.required
      ]),
      confirmacionpassword: new FormControl('', [
        Validators.required
    ])
    });
  }
  get_record(token:string){
    this.loading = true;
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_recuperarpsw',
            {
                p_token:token
            }
        )
            .then(result => {
                this.disable=false;
                if(!result.success){
                  swal(
                    AppComponent.tituloalertas,
                    'Error en el Validacion '+result.mensaje,
                    'info'
                  );
                  this.disable=true;
                }else{
                 // this.p_consecutivo=result.success
                }               
            })
            .catch(error => {
                alert(error._body);
            });
  }
  submit(){
    if(this.form.get("password").value!=this.form.get("confirmacionpassword").value){
      swal(
        AppComponent.tituloalertas,
        'Password y Confirmacion debe ser Iguales ',
        'info'
      );      
    }else{
      this.promiseService.updateService(
        AppComponent.urlservicio + '?_p_action=_cuentaconfigurar&p_operacion=updatepasswordtoken',
        {
            form: this.form.value ,
            p_operacion : 'updatepasswordtoken',
            p_token : this.p_consecutivo 
        }          
    )
        .then(result => {
            swal(
                AppComponent.tituloalertas,
                'Contraseña Actualizada Correctamente',
                'info'
            );                                
           
            this.authenticationService.login(result.datos[0].cliente_correo, this.form.get("password").value)
            .subscribe(result => {                
                if (result === true) {                   
                    this.parent.setLogin("LOGINOK");
                    this.myEvent.emit('LOGINOK');                    
                    this.router.navigate(['/']);
                } else {
                    swal(
                        AppComponent.tituloalertas,
                        'Usuario o Password Incorrectos !',
                        'info'
                      );
                }
            },err=>{
                swal(
                    AppComponent.tituloalertas,
                    'Usuario o Password Incorrectos !',
                    'info'
                  );
            });
        })
        .catch(error => {                          
            alert(error._body);            
        });
    }
  }

  marcas: Marca[] = [
    {value: 'steak-0', viewValue: 'bmw'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

}

