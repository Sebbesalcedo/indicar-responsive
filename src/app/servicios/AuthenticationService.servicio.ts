import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import {AppComponent} from '../app.component'
import 'rxjs/add/operator/catch';
import { ActivatedRoute, Router } from '@angular/router';
//import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    public token: string  ='';
    public redirectUrl:string = '';
 
    constructor(private http: Http,
        private route: ActivatedRoute,
        private router: Router) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
    
    

    login(username: string, password: string): Observable<boolean> {
     //   console.log("user2222",username)
        return this.http.post(AppComponent.urlservicio+'?_p_action=_doLogin', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                //console.log("AAAAAAA")
                //console.log("RES",response);
                // login successful if there's a jwt token in the response
                let name  = response.json() && response.json().name;
                let token = response.json() && response.json().token;
                let tipocliente = response.json() && response.json().tipocliente;
                let tipoasesor  = response.json() && response.json().tipoasesor;
                let codigo      = response.json() && response.json().codigo;
                let telefono    = response.json() && response.json().p_telefonocelular;

                let p_clienteimagen    = response.json() && response.json().p_clienteimagen;
                let p_ciudad_codigo    = response.json() && response.json().p_ciudad_codigo;
                let p_ciudad_nombre    = response.json() && response.json().p_ciudad_nombre;

                if (token) {
                    // set token property
                    this.token = token;
 
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(
                        {   username: username, 
                            token: token ,
                            name : name ,
                            tipocliente : tipocliente ,
                            tipoasesor : tipoasesor ,
                            codigo : codigo ,
                            telefono : telefono ,
                            clienteimagen : p_clienteimagen ,
                            ciudad_codigo : p_ciudad_codigo ,
                            ciudad_nombre : p_ciudad_nombre 
                        }));
 
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch((error:any) => Observable.throw(error._body || 'Server error'));
            
    }
    
 
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        //localStorage.removeItem("listVehiculosComparar");
        
        //this.router.navigate(['/']);
        
    }
}
