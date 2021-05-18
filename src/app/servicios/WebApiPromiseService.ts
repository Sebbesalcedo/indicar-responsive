import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthenticationService } from './AuthenticationService.servicio';
@Injectable()
export class WebApiPromiseService {
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http,
        private authenticationService: AuthenticationService) {
        //this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.headers = new Headers();
        this.options = new RequestOptions({ headers: this.headers });
    }

    getService(url: string): Promise<any> {
        this.headers = new Headers();      
        this.headers = new Headers({ 'Authorization': '' + this.authenticationService.token });
        this.options = new RequestOptions({ headers: this.headers });
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getServiceWithDynamicQueryTerm(url: string, key: string, val: string): Promise<any> {
        this.headers = new Headers();      
        this.headers = new Headers({ 'Authorization': '' + this.authenticationService.token });
        this.options = new RequestOptions({ headers: this.headers });
        return this.http
            .get(url + "/?" + key + "=" + val, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getServiceWithFixedQueryString(url: string, param: any): Promise<any> {
        this.headers = new Headers();        
        this.options = new RequestOptions({ headers: this.headers, search: 'query=' + param });
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getServiceWithComplexObjectAsQueryString(url: string, param: any): Promise<any> {
        let params: URLSearchParams = new URLSearchParams();
       // console.log(param)
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                let val = param[key];
                params.set(key, val);
            }
        }
        this.headers = new Headers();             
        this.headers.append('Authorization', '' + this.authenticationService.token );
        this.options = new RequestOptions({ headers: this.headers, search: params });
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getServiceWithComplexObjectAsQueryString_NoCache(url: string, param: any): Promise<any> {
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
        this.headers.append('Pragma', 'no-cache')        
        this.headers.append('Authorization', '' + this.authenticationService.token );
        this.options = new RequestOptions({ headers: this.headers, search: params });
        return this.http
            .get(url, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    createService(url: string, param: any): Promise<any> {
        //this.headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        //this.headers.append('Authorization', 'Bearer ' + this.authenticationService.token );
        this.headers = new Headers();      
        this.headers.append('Authorization', '' + this.authenticationService.token );
        // this.headers.append('Content-Type', 'application/json');
        this.options = new RequestOptions({ headers: this.headers });        
        let body = JSON.stringify(param);
        return this.http
            .post(url, body, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    updateService(url: string, param: any): Promise<any> {
        //console.log("TOKENNNNN",this.authenticationService.token);  
        this.headers = new Headers();      
        this.headers.append('Authorization', '' + this.authenticationService.token );
        this.options = new RequestOptions({ headers: this.headers });        
        let body = JSON.stringify(param);
        return this.http
            .put(url, body, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    patchService(url: string, param: any): Promise<any> {
        let body = JSON.stringify(param);
        return this.http
            .patch(url, body, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    deleteService(url: string, param: any): Promise<any> {
        let params: URLSearchParams = new URLSearchParams();
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                let val = param[key];
                params.set(key, val);
            }
        }
        this.options = new RequestOptions({ headers: this.headers, search: params });
        return this.http
            .delete(url, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    deleteServiceWithId(url: string, key: string, val: string): Promise<any> {
        return this.http
            .delete(url + "/?" + key + "=" + val, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any): Promise<any> {
        //console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}