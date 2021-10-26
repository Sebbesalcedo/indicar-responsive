import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../../servicios/web-api.service';
import { AppComponent } from '../../app.component';
import { EncryptService } from '../../servicios/encrypt.service';
import { ɵELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio-gangas',
  templateUrl: './inicio-gangas.component.html'
})
export class InicioGangasComponent implements OnInit {
  
  // VARIABLES
  total_items:number = 0;
  items_gangas:any;

  constructor(
    private WebApiService:WebApiService,
    private encrypt:EncryptService
  ) { }

  ngOnInit() {
    this.sendRequest();
  }

  sendRequest(){
    this.WebApiService.getRequest(AppComponent.urlService,
      {
        _p_action: '_inicio',
        p_tabla:'gangas'
      })
    .subscribe(
      data =>{
        this.total_items = data.registros;
        data.datos.forEach(item =>{
          item.venta_codigo = this.encrypt.encrypt(item.venta_codigo);
          if(item.linea_nombrecorto.length > 35){
            item.linea_nombrecorto = item.linea_nombrecorto.substring(0,34)+'...';
          }
        })
        this.items_gangas = data.datos;
      },
      error =>{
        console.log(error);
      }
    )
  }

}



