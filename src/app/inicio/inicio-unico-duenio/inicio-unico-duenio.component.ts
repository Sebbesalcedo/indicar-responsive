import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../../servicios/web-api.service';
import { AppComponent } from '../../app.component';
import { EncryptService } from 'src/app/servicios/encrypt.service';

@Component({
  selector: 'app-inicio-unico-duenio',
  templateUrl: './inicio-unico-duenio.component.html'
})
export class InicioUnicoDuenioComponent implements OnInit {
  // VARIABLES
  total_items:number = 0;
  items_unico_duenio:any = {};

  constructor(
    private WebApiService:WebApiService,
    private encrypt:EncryptService
  ) { }

  ngOnInit() {
    this.sendRequest();
  }

  sendRequest(){
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action: '_inicio',
      p_tabla: 'unicoduenno'
    })
    .subscribe(
      data =>{
        this.total_items = data.registros;
        data.datos.forEach(item => {
          item.venta_codigo = this.encrypt.encrypt(item.venta_codigo);
          if(item.linea_nombrecorto.length > 35){
            item.linea_nombrecorto = item.linea_nombrecorto.substring(0,34)+'...';
          }
        });
        this.items_unico_duenio = data.datos;
      },
      error =>{
        console.log(error);
      }
    );
  }

}
