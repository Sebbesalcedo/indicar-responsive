import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class GlobalService {
  accessControlAllowOrigin = "*";
  contentTypeJson = "application/json; charset=utf-8";
  contentTypeText = "text/html; charset=utf-8";

  constructor(private _http: HttpClient) {}

  /**
   */

  getData(ruta): Observable<any> {
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );

    return this._http.get(ruta, { headers: headers });
  }

  postData(ruta, params): Observable<any> {
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );

    let json = JSON.stringify(params);
    let data = "json=" + json;

    // console.log(this.urlValorador + ruta);
    return this._http.post(ruta, data, { headers: headers });
  }

  updateData(url,id,params):Observable<any>{

    let json = JSON.stringify(params);
    let data = 'json=' + json;

    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );

    return this._http.put( url+'/'+id, data, {
      headers: headers,
    });

  }

  //para wompi

  getPago(ruta): Observable<any> {
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );

    return this._http.get(ruta, { headers: headers });
  }

  viewData(ruta,id): Observable<any> {
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );

    return this._http.get(ruta+'/' +id, { headers: headers });
  }



}
