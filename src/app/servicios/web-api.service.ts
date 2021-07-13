import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebApiService{

  // CONSTANTES DE CONFIGURACION
  accessControlAllowOrigin  = '*';
  contentTypeJson           = 'application/json; charset=utf-8';
  contentTypeText           = 'text/html; charset=utf-8';
  // TOKEN DE SEGURIDAD
  public token = '';



  constructor(
    private _http:HttpClient,
   
    ){ 
    
  }

  setHeaders(){
    let headers = new HttpHeaders()
    .append('Authorization', this.token)
    return headers;    
  }
  
//  authenticationService(token:string):Observable<any>{

//    params =this.setHeaders();
//    token = JSON.stringify(token);
//    return this._http.post<any>(url,body,{headers,params});

//   }

  /* METHOD GET */
  getRequest(url:string,params:any):Observable<any>{
    params = this.processParams(params)
    let headers = this.setHeaders();
    return this._http.get<any>(url,{headers, params});
  }

  

  postRequest(url:string,body:any,params:any):Observable<any>{
    // header
    let headers = this.setHeaders();
    body = JSON.stringify(body);
    // parametros
    return this._http.post<any>(url,body,{headers,params});
  }
  // postFileRequest(url:string,body:any,params:any){
  //   console.log(body);
  //   return this._http.post<any>(url,body,{params});
  // }
  
  putRequest(url:string,body:any,params:any):Observable<any>{
    // header
    let headers = this.setHeaders();
    body = JSON.stringify(body);
    // parametros
    return this._http.put<any>(url,body,{headers,params});
  }

  deleteRequest(url:string,body:any,params:any){
    let headers = this.setHeaders();
    params = Object.assign(body,params);
    params = this.processParams(params);
    // body = JSON.stringify(body);
    return this._http.delete(url,{headers,params});
  }

  processParams(params:any){
    let queryParams = {};
    for(var key in params){
      if(params[key] != undefined && params[key] !=null){
        queryParams[key] = params[key];
      }
    }
    return new HttpParams({fromObject:queryParams});
  }


 

}
