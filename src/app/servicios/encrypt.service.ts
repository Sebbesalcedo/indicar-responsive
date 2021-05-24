import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() {}
  
  encrypt(cod:string){
    var str;
    str = btoa(cod);
    str = btoa(str);
    return str;
  }
  desencrypt(cod:string){
    var str;
    str = atob(cod);
    if(str != null && str != undefined){
      str = atob(str);
      return str;
    }else{
      console.error('problemas de encriptación');
    }
  }
}
