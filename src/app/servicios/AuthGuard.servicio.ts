import { Injectable } from '@angular/core';
import { Router, CanActivate ,ActivatedRouteSnapshot , RouterStateSnapshot} from '@angular/router';
import { AppComponent } from '../app.component';
import swal from 'sweetalert2';
import { AuthenticationService } from '../servicios/AuthenticationService.servicio';
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router,
    private authenticationService:AuthenticationService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        let url: string = state.url;
        this.authenticationService.redirectUrl = url;
       // alert(url);
        swal({
            title: AppComponent.tituloalertas,
            html: "<b>¡Hola! Inicia sesión para continuar</b> <br/>  <br/> <b>¿Deseas iniciar sesión?</b>",  
            type: 'warning',
            showCancelButton: true,
            //confirmButtonColor: '#3085d6',
            //cancelButtonColor: '#d33',
            cancelButtonText:'No',
            confirmButtonText: 'Si'
          }).then((result) => {
            if (result.value) {
                this.router.navigate(['/login']);
                return false;
            }else{
                this.router.navigate(['/']);
                return false;
            }            
          })
        
        /*
        swal(
            AppComponent.tituloalertas,
            'Es necesarios Logearse para ingresar a esta opcion.',
            'info'
          );
          */
        // not logged in so redirect to login page
        //this.router.navigate(['/login']);
        return false;
    }
}