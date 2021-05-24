import { Injectable } from '@angular/core';
//dependencias
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService{
  // VARIABLES
  public token:string = '';

  constructor(
    private WebApiService:WebApiService
  ) { }

  /**
   * @description   Metodo usado para loguear usuario en indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @param         username usario del cliente
   * @param         pass contraseña del cliente
   * @return        true | false
   */
  login(username,pass){
    let body = {};
    body['username'] = username;
    body['password'] = pass;
    return this.WebApiService.postRequest(AppComponent.urlService,body,{
      _p_action:'_doLogin'
    });
  }

  /**
   * @description   Metodo usado para desloguear usuario en indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @return        true | false
   */
  logout(){
    this.WebApiService.token='';
    localStorage.removeItem('currentUser');
  }

  /**
   * @description   Metodo usado para chequear si usuario existe en la base de dato de indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @return        true | false
   */
  checkEmail(mail){
    return this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action: '_putCuentaConfigurar',
      p_validacion: 'EMAIL',
      p_email: mail.toLowerCase()
    })
  }

  /**
   * @description   Metodo usado para registrar usuarios en indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         28-11-2019
   * @return        observable
   */
  register(data){
    return this.WebApiService.postRequest(AppComponent.urlService,data,{
      _p_action:'_putCuentaConfigurar'
    });
  }

  /**
   * @description   Metodo usado para setear en servicio de solicitudes el token en los headers de las solicitudes.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         28-11-2019
   */
  setToken(token){
    this.WebApiService.token = token;
  }


}
