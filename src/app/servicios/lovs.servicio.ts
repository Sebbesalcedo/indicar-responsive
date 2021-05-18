import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { lovPreciodesde     } from '../clases/lov/lovPreciodesde.class';
import { lovPreciohasta     } from '../clases/lov/lovPreciohasta.class';
import { lovMarca           } from '../clases/lov/lovMarca.class';
import { lovFamilia         } from '../clases/lov/lovFamilia.class';
import { lovAnno            } from '../clases/lov/lovAnno.class';
import { lovClase           } from '../clases/lov/lovClase.class';
import { lovForma           } from '../clases/lov/lovForma.class';
import { lovTraccion        } from '../clases/lov/lovTraccion.class';
import { lovCaja            } from '../clases/lov/lovCaja.class';
import { lovTipomotor       } from '../clases/lov/lovTipomotor.class';
import { lovCapacidadmotor  } from '../clases/lov/lovCapacidadmotor.class';
import {AppComponent } from '../app.component'
import 'rxjs/operator/toPromise' ;

@Injectable()
export class lovsServicio{
    //private ruta:string = "http://siisa_ec.processoft.com.co/sistema/fgetLinea.php";
    private ruta = AppComponent.urlservicio;
    constructor( private http:Http){

    }
    //getDataHttp():Promise<lovPreciodesde[]>{
    getDataHttp_Preciodesde():lovPreciodesde[]{    
        
        return [
            {"codigo":"1","descripcion":"10000000","cantidad":"3"},
            {"codigo":"2","descripcion":"15000000","cantidad":"5"},
            {"codigo":"3","descripcion":"20000000","cantidad":"6"},
            {"codigo":"4","descripcion":"25000000","cantidad":"20"},
            {"codigo":"5","descripcion":"30000000","cantidad":"22"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Preciohasta():lovPreciohasta[]{    
        
        return [
            {"codigo":"1","descripcion":"20000000","cantidad":"3"},
            {"codigo":"2","descripcion":"25000000","cantidad":"5"},
            {"codigo":"3","descripcion":"30000000","cantidad":"6"},
            {"codigo":"4","descripcion":"35000000","cantidad":"20"},
            {"codigo":"5","descripcion":"40000000","cantidad":"22"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Marca():Promise<lovMarca[]>{
        this.ruta  += "?_p_action=_getMarca";       
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovMarca[] = JSON.parse(respuesta._body).datos;
                    //console.log(datos);
                    return datos;
                }
            ).catch();
            
    }
    getDataHttp_Familia():lovFamilia[]{    
        
        return [
            {"codigo":"1","descripcion":"PICANTO","cantidad":"13"},
            {"codigo":"2","descripcion":"RIO","cantidad":"35"},
            {"codigo":"3","descripcion":"SOUL","cantidad":"46"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Anno():lovAnno[]{    
        
        return [
            {"codigo":"1","descripcion":"2017","cantidad":"13"},
            {"codigo":"2","descripcion":"2016","cantidad":"35"},
            {"codigo":"3","descripcion":"2015","cantidad":"46"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Clase():lovClase[]{    
        
        return [
            {"codigo":"1","descripcion":"AUTOMOVIL","cantidad":"13"},
            {"codigo":"2","descripcion":"CAMIONETA","cantidad":"35"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Forma():lovForma[]{    
        
        return [
            {"codigo":"1","descripcion":"CUATRO PUERTAS","cantidad":"13"},
            {"codigo":"2","descripcion":"CINCO PUERTAS","cantidad":"35"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Traccion():lovTraccion[]{    
        
        return [
            {"codigo":"1","descripcion":"4x2","cantidad":"13"},
            {"codigo":"2","descripcion":"4x4","cantidad":"35"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Caja():lovCaja[]{    
        
        return [
            {"codigo":"1","descripcion":"AUT","cantidad":"13"},
            {"codigo":"2","descripcion":"MEC","cantidad":"35"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Tipomotor():lovCaja[]{    
        
        return [
            {"codigo":"1","descripcion":"DIE","cantidad":"13"},
            {"codigo":"2","descripcion":"GSL","cantidad":"35"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
    getDataHttp_Capacidadmotor():lovCapacidadmotor[]{    
        
        return [
            {"codigo":"1","descripcion":"1000 CC","cantidad":"13"},
            {"codigo":"2","descripcion":"1200 CC","cantidad":"35"}
          ];
        /*
        return this.http.get(this.ruta)
            .toPromise().then(
                (response ) => {
                    
                    let respuesta:any = response;//console.log(respuesta._body);
                    let datos:lovPreciodesde[] = JSON.parse(respuesta._body);
                    return datos;
                }
            ).catch();
            */
    }
}