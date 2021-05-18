import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
@Component({
  selector: 'app-nuevo-item',
  templateUrl: '../templates/nuevo.item.template.html'
  //,styleUrls: ['./heroes.component.css']
})
export class NuevoItemComponent implements OnInit {
  @Input() item;
  @Input() filtros;
  @Input() totalregsitros;
  codigo_usuario:string='';
  //@Input() cliente;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promiseService: WebApiPromiseService
  ) { }
  ngOnInit() {
    let c_user = JSON.parse(localStorage.getItem('currentUser'));
    if(c_user!=null){
      this.codigo_usuario=c_user.codigo;
    }
  }
  detail(pcodigo: string, panno: string): void {
    this.router.navigate(['nuevo/detalle',pcodigo+panno]);  
    /*this.router.navigate(['nuevo/detalle'], {
      queryParams: {
        p_codigo: pcodigo,
        p_anno: panno
      }
    });*/
  }
  setFavorito(pcodigo: string, panno: string, index: number): void {
    
    if(this.item[index].isfavorito=='S'){
      
      this.promiseService.deleteService(
        AppComponent.urlservicio + '?_p_action=_clientefavorito',
        {
          linea_codigo: pcodigo,
          linea_modelo: panno 
        }
        //this.data_file_otras
      )
        .then(result => {
            //console.log(result.datos)            
            this.item[index].isfavorito = 'N';
        })
        .catch(error => {
            this.item[index].isfavorito = 'S';
            alert(error._body)            
        });
      
    }else{
      this.promiseService.createService(
        AppComponent.urlservicio + '?_p_action=_clientefavorito',
        {
          linea_codigo: pcodigo,
          linea_modelo: panno 
        }
        //this.data_file_otras
      )
        .then(result => {
            //console.log(result.datos)            
            this.item[index].isfavorito = 'S';
        })
        .catch(error => {
            this.item[index].isfavorito = 'N';
            alert(error._body)            
        });
      
    }  
    //this.router.navigate(['nuevo/detalle',pcodigo+panno]);     
  }
  change():void{          
    this.router.navigate(['nuevo'], { queryParams: this.filtros }); 
    //this.router.navigate(['nuevo'], { queryParams: this.filtros }); 
  }
} 