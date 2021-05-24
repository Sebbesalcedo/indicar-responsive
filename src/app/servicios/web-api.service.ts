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
    private _http:HttpClient
    ){ 
    
  }

  setHeaders(){
    let headers = new HttpHeaders()
    .append('Authorization', this.token)
  //    .append('Content-Type','text/html; charset=UTF-8');
    return headers;    
  }
  // setHeadersFile(){
  //   let headers = new HttpHeaders()
  //     .append('Authorization', this.token)
  //     .append('Content-Type', 'multipart/form-data; boundary=something');
  // //    .append('Content-Type','text/html; charset=UTF-8');
  //   return headers;    
  // }


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


  // MANEJOS DE RESPUESTAS.

  // private handleError(error: any): Promise<any> {
  //   //console.error('An error occurred', error);
  //   return Promise.reject(error.message || error);
  // }
  // private extractData(res: Response) {
  //   let body = res.json();
  //   return body || {};
  // }



  /* METHOD POST */
  /* METHOD PUT */
  /* METHOD DELETE */



  /*getServiceWithComplexObjectAsQueryString_NoCache(url: string, param: any): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
   // console.log(param)
    for (var key in param) {
        if (param.hasOwnProperty(key)) {
            let val = param[key];
            params.set(key, val);
        }
    }
    this.headers = new Headers();   
    this.headers.append('Cache-control', 'no-cache');
    this.headers.append('Cache-control', 'no-store');
    this.headers.append('Expires', '0');
    this.headers.append('Pragma', 'no-cache');
    // this.headers.append('Access-Control-Allow-Origin','*');
    this.headers.append('Authorization', '' + this.authenticationService.token );
    this.options = new RequestOptions({ headers: this.headers, search: params });
    return this.http
        .get(url, this.options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
}*/
}
// // INTERFACE
// export interface data{
//   registros:number,
//   success:boolean,
//   datos:any
// }
