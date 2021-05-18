import { Component, OnInit , Inject , EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { lovTipoContrato } from '../clases/lov/lovTipoContrato.class'
import { lovPerfil } from '../clases/lov/lovPerfil.class';
import { lovTipodocumento } from '../clases/lov/lovTipodocumento.class';
import { AppComponent } from '../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { currentUser } from '../interface/currentuser.interface';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { AuthenticationService } from '../servicios/AuthenticationService.servicio';
import {EncabezadoComponent} from './encabezado.component';
import swal from 'sweetalert2';
//import { ErrorMessage } from "../interface/ErrorMessage.interface";

//import { Subject } from 'rxjs';
//import { debounceTime } from 'rxjs/operators';
import { lovCiudades } from '../clases/lov/lovCiudades.class'
@Component({
    selector: 'app-solicitar-creedito',
    templateUrl: '../templates/solicitar-credito.template.html',
    styleUrls: ['../css/solicitarCredito.css']
})

export class SolicitarCreditoComponent implements OnInit {
    isLogin:boolean = false;
    error: string = '';
    success: string = '';
    currentuser: currentUser;
    //FORM
    form_solicitud: FormGroup;
    formGroup2: FormGroup;
    //FILTROS
    p_filtros = {};
    options;
    lovCiudades: lovCiudades[];
    //FILTROS
    modelo = {
        email: '',
        //permitecomentario: '',
        nombre: '',
        //apellidos: '',
        //tipodocumento: '',
        //numerodocumento: '',
        //fnacimiento: '',
        telefono: '',
        ciudad_residencia:''
        //,tcontrato: ''
        //,fingreso: ''
        //,idemostrable: ''
    };
    //LOVS
    lovTipoContrato: lovTipoContrato[];
    lovPerfil: lovPerfil[];
    lovFinancieras:any;
    lovTipodocumento: lovTipodocumento[];
    public mask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    public numberMask = createNumberMask({
        prefix: '',
        suffix: '' // This will put the dollar sign at the end, with a space.
    });
    staticAlertClosed = false;
    successMessage: string;
    @Output() myEvent = new EventEmitter<string>();
    constructor(
        private fb: FormBuilder,
        private promiseService: WebApiPromiseService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService ,
        @Inject(EncabezadoComponent) private parent: EncabezadoComponent 
    ) {
        //this.init_forms();                        
    }
    init_forms() {
        this.form_solicitud = this.fb.group({
            email: new FormControl('', [
                Validators.required,
                Validators.email
                //Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
            ]),
            email_confirmacion: new FormControl('', [
                Validators.required,
                Validators.email
                //Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
            ]),
            nombre: new FormControl('', [
                Validators.required,                
                Validators.maxLength(100)
            ]),            
            telefono: new FormControl('', [
                Validators.required
            ]),
            perfil: new FormControl('', [
                Validators.required
            ]),            
            ciudad_residencia: new FormControl('', [
                Validators.required
            ])
        });


        this.form_solicitud.controls.ciudad_residencia.valueChanges.subscribe(value => {
            this.promiseService.getServiceWithComplexObjectAsQueryString(
                AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVCIUDADES',
                {
                    p_filtro: value
                }
            )
                .then(result => {
                    this.lovCiudades = result.datos;
                   // console.log("lovCiudades", this.lovCiudades)
                })
                .catch(error => console.log(error));
        });
    }

    displayFn(ciudad?: lovCiudades): string | undefined {        
        return ciudad ? ciudad.ciudad_nombre : undefined;
    }
    onSubmit(financiera:any) {
        /*console.log("Finnn1",financiera);
        alert(financiera.financiera_urllead);
        if(financiera.financiera_urllead==null){
            alert('aaaaa');
        }
        return;*/
        this.markFormGroupTouched(this.form_solicitud);        
        this.success = '';
        this.error = '';
        if (!this.form_solicitud.valid) {         
            this.error = 'Errores en el Formulario';
            window.scrollTo(0, 0);
            return false;
        }
        this.form_solicitud.get("telefono").setValue(this.form_solicitud.get("telefono").value.replace(/\D+/g, ''));
        //this.form_solicitud.get("idemostrable").setValue(this.form_solicitud.get("idemostrable").value.replace(/\D+/g, ''));


        

        this.promiseService.createService(
            AppComponent.urlservicio + '?_p_action=_solicitudesCredito2',
            {
                form_solicitud: this.form_solicitud.value,
                p_financiera:financiera.financiera_codigo
            }
        )
            .then(result => {
                swal(
                    AppComponent.tituloalertas,
                    'Datos actualizados correctamente !',
                    'info'
                );
                this.options = result.datos;               
                if(financiera.financiera_codigo=='4'){
                    swal(
                        AppComponent.tituloalertas,
                        'Será dirigido a la pagina de colpatria para terminar el proceso !!',
                        'info'
                    );
                    //if(financiera.financiera_urllead!=null){
                        window.open(financiera.financiera_urllead);                       
                    //}
                    //window.open("https://colpatriavehiculos.pasarelaconecta.com.co/Request/ValidateProduct?productType=134&entityKey=Abc123456x9&_ga=2.262243909.818621838.1547041485-1622441457.1520000807&utm_source=indicar&utm_medium=indicar&utm_campaign=crvh-crvh-co-___-in-ds-br-ccn-");
                    //window.open("https://colpatriavehiculos.pasarelaconecta.com.co/Request/ValidateProduct?productType=134&entityKey=Abc123456x9&_ga=2.262243909.818621838.1547041485-1622441457.1520000807&utm_source=aliado&utm_medium=indicar&utm_campaign=crvh-crvh-co-___-in-ds-br-ccn-");
                    //window.open("https://colpatriavehiculos.pasarelaconecta.com.co/Request/ValidateProduct?productType=134&entityKey=Abc123456x9");
                }else{
                    swal(
                        AppComponent.tituloalertas,
                        'Datos actualizados correctamente !',
                        'info'
                    );
                }
                //console.log(result)
                //console.log(this.options)
                //alert(this.options[0].cliente_correo)
                //alert(this.options[0].cliente_passwordtemporal)
                window.scrollTo(0, 0);                
                this.authenticationService.login(this.options[0].cliente_correo, this.options[0].cliente_passwordtemporal)
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
                alert(error._body)
            });    
    }
    ngOnInit() {
        this.init_forms();
        this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
        console.log("CUSER", this.currentuser)
        if (this.currentuser != null) {
            this.p_filtros['p_token'] = JSON.parse(localStorage.getItem("currentUser")).token;
            this.form_solicitud.get("nombre").setValue(this.currentuser.name);
            this.form_solicitud.get("telefono").setValue(this.currentuser.telefono);
            this.form_solicitud.get("email").setValue(this.currentuser.username);
            this.form_solicitud.get("email_confirmacion").setValue(this.currentuser.username);
            
            this.isLogin=true;
        }else{
            this.form_solicitud.get("email").setValue('');
            this.form_solicitud.get("email_confirmacion").setValue('');
            this.isLogin=false;
        }
        this.sendRequest();
    }

    //alerta
    public changeSuccessMessage() {
        //  this._success.next(`Gracias por su colaboración, el reporte ha sido enviado con éxito`);
    }
    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                control.controls.forEach(c => this.markFormGroupTouched(c));
            }
        });
    }

    sendRequest() {
        //PERFIL
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getLovs',
            {
                p_lov: '_LOVTIPOPERFIL'
            }
        )
            .then(result => {
                this.lovPerfil = result.datos;
            })
            .catch(error => console.log(error));

        //CIUDADES    
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVCIUDADES',
            {
                p_filtro: ''
            }
        )
            .then(result => {
                //console.log(result.datos)
                this.options = result.datos;
            })
            .catch(error => console.log(error));
        //FINANCIERAS    
        this.promiseService.getServiceWithComplexObjectAsQueryString(
                AppComponent.urlservicio + '?_p_action=_getLovs',
                {
                    p_lov: '_LOVFINANCIERAS'
                }
            )
                .then(result => {
                    this.lovFinancieras = result.datos;
                    console.log("FIN",this.lovFinancieras);
                })
                .catch(error => console.log(error));    


    }



    clearFilter() {
        this.modelo = {

            email: '',
            //permitecomentario: '',
            nombre: '',
            //apellidos: '',
            //tipodocumento: '',
            //numerodocumento: '',
            //fnacimiento: '',
            telefono: '',
            ciudad_residencia:''
            //,            tcontrato: ''
            //,fingreso: ''
            ///,idemostrable: ''

        };
        this.lovPerfil = []
        this.lovTipoContrato = [];
        this.lovTipodocumento = [];
    }

}

