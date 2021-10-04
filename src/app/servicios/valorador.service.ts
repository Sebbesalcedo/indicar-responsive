import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ValoradorService {

  accessControlAllowOrigin  = '*';
  contentTypeJson           = 'application/json; charset=utf-8';
  contentTypeText           = 'text/html; charset=utf-8';

  public urlValorador: String    ="http://api.libroazul.com.co/";

  constructor(private _http: HttpClient) { }

    /**
     */

   getData(ruta): Observable<any> {



   let route= this.urlValorador + ruta;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');


    return this._http.get(route,{ headers: headers });
  }




  postData(ruta,params): Observable<any> {
        let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

       let json = JSON.stringify(params);
    let data = 'json=' + json;
    // console.log(this.urlValorador + ruta);
      return this._http.post(this.urlValorador + ruta,data, { headers: headers });
  }
}
