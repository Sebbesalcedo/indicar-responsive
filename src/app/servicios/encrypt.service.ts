import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { t, l } from '@angular/core/src/render3';
import swal from 'sweetalert2';

@Injectable()
export class EncryptService {

  constructor(private router: Router) { 
  }
  encrypt(cod:string){
    var str;
    str = btoa(cod);
    str = btoa(str);
    return str;
  }
  desencrypt(cod:string){
    var str;
    str = atob(cod);
    str = atob(str);
    return str;

  }
  /*encrypt(cod:number){
    var str,l,strnumber;
    str = cod.toString(); //convierto el codigo en string para tratarlo.
    l = str.length;       //largo
    strnumber ="";        //string final, luego se parsa a number
    for(let i = 0; i < l;i++){
      // strnumber += str.substring(i,i+1).charCodeAt(0);
      strnumber += str.substring(i,i+1).btoa();
    }
    return parseInt(strnumber);
  }*/
  /*desencrypt(cod:number,len:number){
    let aux,strEncriptado,strnumber,laux;
    strEncriptado = cod.toString();
    if(strEncriptado.toString().length%2 !== 0){ // error en codigo. no puede ser impar.
      // redirigir al inicio.
        swal(
          'Error',
          'Clasificado no disponible!',
          'error'
        );
        this.router.navigate(['/']);
    }else{
      laux=2;
      aux=2;
      strnumber="";
      for(var i=0;i<len;i++){
        strnumber+=String.fromCharCode(strEncriptado.substring(i*laux,aux));
        aux+=2;
      }
      aux=2;
      return parseInt(strnumber);
    }
  }*/
}
