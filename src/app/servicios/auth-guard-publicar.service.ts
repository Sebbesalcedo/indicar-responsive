import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
//servicios
import { AuthenticationService } from './authentication-service.service';
//dependencias
import swal from 'sweetalert2';
import { EncabezadoComponent } from '../components/encabezado.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardPublicarService implements CanActivate{

  constructor(
    public auth:AuthenticationService,
    public router:Router
  ){}

  canActivate():boolean{
    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    }else{
      this.router.navigate(['/inicio']);
      swal.fire({
        title:'',
        text: 'Debes iniciar sesión para realizar esta acción',
        icon: null,
      })
      let log;
      log = document.querySelector('.login .login');
      log.click();
    }
  }
}
