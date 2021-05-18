import { Component, OnInit, EventEmitter, Input,Output,ViewChild , Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthenticationService } from '../servicios/AuthenticationService.servicio';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { EncabezadoComponent } from './encabezado.component';

 
@Component({
    selector: 'app-login',
    moduleId: module.id,
    templateUrl: '../templates/login.template.html',
    styleUrls: ['../css/registro.css']
})
 
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
    modalReference;
    @Output() myEvent = new EventEmitter<string>();
    @ViewChild('encabezado') encabezado: EncabezadoComponent;
    //Botón para mostrar contraseña
    password_type: string = 'password';

    togglePasswordMode() {   
       this.password_type = this.password_type === 'text' ? 'password' : 'text';
    }

 
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        @Inject(EncabezadoComponent) private parent: EncabezadoComponent,
        private  modalService: NgbModal) { }
 
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        window.scrollTo(0, 0);
    }
    
    login() {
        //console.log("user",this.model.username)
        //console.log("paswwrd",this.model.password)
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                //console.log("LOGIN OK",result)
                if (result === true) {
                    //console.log("LONGINOK123")
                    //console.log("XCARRRRRR",this.encabezado);
                    this.parent.setLogin("LOGINOK");
                    this.myEvent.emit('LOGINOK');
                    // login successful
                    //this.router.navigate(['/']);
                   // alert(this.authenticationService.redirectUrl);
                    this.router.navigateByUrl(this.authenticationService.redirectUrl);
                    //this.router.navigate([this.authenticationService.redirectUrl]);
                    //AuthenticationService
                } else {
                    swal(
                        AppComponent.tituloalertas,
                        'Usuario o Password Incorrectos !',
                        'info'
                      )
                    // login failed
                    //console.log("LONGINFAIL")
                    //this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            },err=>{
                swal(
                    AppComponent.tituloalertas,
                    'Usuario o Password Incorrectos !',
                    'info'
                  )
                //console.log("LOGIN FAIL")
                //this.error = err+'';
                    this.loading = false;
            });
    }
}