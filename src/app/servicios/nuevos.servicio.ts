import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { nuevotarjeta } from '../clases/nuevotarjeta.class';
import 'rxjs/operator/toPromise' ;

@Injectable()
export class NuevosServicio{
    private ruta:string = "http://siisa_ec.processoft.com.co/sistema/fgetLinea.php";
    constructor( private http:Http){

    }
    getDataHttp():Promise<nuevotarjeta[]>{

        
        /*
        this.options = new RequestOptions({ headers: this.headers, search: params });
        return this.http
        .get(url, this.options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
        */

        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let lineas:nuevotarjeta[] = JSON.parse(respuesta._body);
                    return lineas;
                }
            ).catch();
    }
}