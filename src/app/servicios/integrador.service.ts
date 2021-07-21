import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class IntegradorService {
  // CONSTANTES DE CONFIGURACION
  accessControlAllowOrigin = "*";
  contentTypeJson = "application/json; charset=utf-8";
  contentTypeText = "text/html; charset=utf-8";
  // TOKEN DE SEGURIDAD
  public token = "";
  public urlIntegrador: String =
    "https://integrador.processoft.com.co/api/crm/";

  constructor(private _http: HttpClient) {}

  postIntegrador(url: string, body: any, params: any): Observable<any> {

      console.log(body);



    let headers: HttpHeaders = new HttpHeaders();



    let urlPost = this.urlIntegrador + url;
    return this._http.post<any>(urlPost, body, { headers, params });
  }

  // postsIntegrador(url: string, body: any, params: any): Observable<any> {
  //   // let headers = this.setHeaders();

  //   let headers = new HttpHeaders().append("Authorization", body.res.data.token, "user",89);
  //   let urlPost = this.urlIntegrador + url;

  //   return this._http.post<any>(urlPost,body , { headers, params });
  // }
}
