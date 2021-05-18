import { Component, OnInit, Input,Pipe,PipeTransform,Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import swal from 'sweetalert2';
import { EncabezadoComponent } from './encabezado.component';
import { MatSnackBar } from '@angular/material';
import { EncryptService } from '../servicios/encrypt.service'

@Component({
  selector: 'app-usado-item2',
  templateUrl: '../templates/usado.item.template.html'
  // styleUrls: ['./heroes.component.css']
})
export class UsadoItemComponent implements OnInit {
    @Input() item;
    @Input() filtros;
    @Input() totalregsitros;
    @Input() cliente;
    comparador: boolean = true;
    codigo_usuario:string='';
    listcompare:string[]=[];
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private promiseService: WebApiPromiseService,
      private snackBar: MatSnackBar,
      @Inject(EncabezadoComponent) private parent: EncabezadoComponent,
      private Encrypt: EncryptService
    ) { }
    ngOnInit() {
      let c_user = JSON.parse(localStorage.getItem('currentUser'));
      if(c_user!=null){
        this.codigo_usuario=c_user.codigo;
      }
      if(localStorage.getItem('listVehiculosComparar')!=undefined&&localStorage.getItem('listVehiculosComparar')!=null)
        this.listcompare = JSON.parse(localStorage.getItem('listVehiculosComparar')); 
      console.log("listcompare",this.listcompare);  
        
    }    
    detail(pcodigo:string):void{    
      this.router.navigate(['clasificados/detalle',pcodigo]);
      // console.log(pcodigo);
    }
    change():void{          
      this.router.navigate(['clasificados'], { queryParams: this.filtros }); 
    }
    trackByFn(index, item) {
      return index; // or item.id
    }

    setFavorito(pcodigo:string, index: number, nombre: string): void {    
      console.log(pcodigo);
      let cod = this.Encrypt.desencrypt(pcodigo);
      if(this.item[index].isfavorito=='S'){        
        this.promiseService.deleteService(
          AppComponent.urlservicio + '?_p_action=_clientefavorito',
          {
            venta_codigo: cod
          }
          // this.data_file_otras
        )
          .then(result => {
              // console.log(result.datos)            
              this.item[index].isfavorito = 'N';
          })
          .catch(error => {
              this.item[index].isfavorito = 'S';
              alert(error._body);             
          });

        this.snackBar.open(nombre + ' removido de favoritos', 'Aceptar', {
          duration: 3000
        });
      }else{
        this.promiseService.createService(
          AppComponent.urlservicio + '?_p_action=_clientefavorito',
          {
            venta_codigo: cod
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
        this.snackBar.open(nombre + ' agregado a favoritos', 'Aceptar', {
          duration: 3000
        });

      }  
      //this.router.navigate(['nuevo/detalle',pcodigo+panno]);     
    }
    setCompare(pcodigo: string, index: number, nombre: string): void { 
     // localStorage.removeItem("listVehiculosComparar");
      let c_compare =null;   
       console.log("c_compare 1",localStorage.getItem('listVehiculosComparar'));
      if(localStorage.getItem('listVehiculosComparar')!=undefined)
        c_compare = JSON.parse(localStorage.getItem('listVehiculosComparar'));   
        console.log("c_compare 2",c_compare);
      if(c_compare==null){
        var veh:string[]=[];
        veh.push(pcodigo);
        localStorage.setItem("listVehiculosComparar",JSON.stringify(veh)); 
        this.listcompare.push(pcodigo);
        this.parent.operacionComparar();
      }else{
        //alert(c_compare.indexOf(pcodigo))
        if(this.listcompare.indexOf(pcodigo) >=0 ){
          this.listcompare.splice(this.listcompare.indexOf(pcodigo), 1);
          c_compare.splice(this.listcompare.indexOf(pcodigo), 1);
          localStorage.setItem("listVehiculosComparar",JSON.stringify(c_compare)); 
          this.parent.operacionComparar();
          this.snackBar.open('Vehículo removido', 'Aceptar', {
            duration: 3000
          });
          return;
        } 
        //alert(c_compare.length)
        if(c_compare.length<=3){
          this.listcompare.push(pcodigo);
          c_compare.push(pcodigo);
          console.log("c_compare 3",c_compare);
          localStorage.setItem("listVehiculosComparar",JSON.stringify(c_compare)); 
          this.parent.operacionComparar();

          this.snackBar.open(nombre + ' agregado a comparar', 'Aceptar', {
            duration: 3000
          });
        }else{
          swal(
            AppComponent.tituloalertas,
            'Solo se pueden comparar hasta 4 Vehiculos',
            'info'
          );
        //  window.scrollTo(0, 0);
          return;
        }
      }  
      //this.router.navigate(['nuevo/detalle',pcodigo+panno]);     
    }
} 

