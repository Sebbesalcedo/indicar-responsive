import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
// SERVICIOS
import { WebApiService } from 'src/app/servicios/web-api.service';
import { EncryptService } from 'src/app/servicios/encrypt.service';
// DEPENDENCIAS
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario-favorito',
  templateUrl: './usuario-favorito.component.html',
  styleUrls: ['./usuario-favorito.component.css']
})
export class UsuarioFavoritoComponent implements OnInit {
  // VARIABLES
  records:number              = 1;
  datos: any                  = [];
  dataSource: any             = [];
  displayedColumns:String[] = ['select','cod','vehiculo','fecha','tipo','acciones'];

  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(
    private WebApiService:WebApiService,
    private Encrypt:EncryptService,
    private router:Router,
    public snackBar: MatSnackBar
  ){}

  ngOnInit(){
    this.sendRequest();
  }

  sendRequest(){
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action:'_clientefavorito'
    })
    .subscribe(
      data=>{
        this.records = data.registros;
        this.datos = data.datos;
        if(data.registros > 0){
          this.generateTable(this.datos);
        }
      },
      error=>{
        console.log(error);
      }
    )
  }


  generateTable(data:any){
    data.map(element=>{
      element['codEncriptado'] = this.Encrypt.encrypt(element.codigointerno);
      element['select'] = false;
    });
    this.dataSource             = new MatTableDataSource(data);
    this.dataSource.sort        = this.sort.toArray()[0];
    this.dataSource.paginator   = this.paginator.toArray()[0];
  }

  deleteFavorite(cod,type){
    let body;
    if(type == 'USADO'){
      body = {
        venta_codigo: this.Encrypt.desencrypt(cod)
      }
    }else{
      body = {
        nuevo_codigo: this.Encrypt.desencrypt(cod)
      }
    }
    
    this.WebApiService.deleteRequest(AppComponent.urlService,body,{
      _p_action: '_clientefavorito'
    })
    .subscribe(
      data=>{
        // console.log(data);
        this.snackBar.open('¡Datos eliminados correctamente!', null, {
          duration: 3000
        });
        this.sendRequest();
      },
      error=>{
        this.snackBar.open('Error al actualizar', null, {
          duration: 3000
        });
      }
    )
  }

  optionRow(cod,action,tipo){
    switch(action){
      case "VER":
        if(tipo == "USADO"){
          this.router.navigate(['clasificado/detalle',cod]);
        }else{
          console.log('especificar la ruta de nuevos...');
        }
      break;
      case "ELIMINAR":
        swal.fire({
          text: "¿Eliminar de favoritos?",
          icon: null,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        })
        .then(result=>{
          if(result.value){
            this.deleteFavorite(cod,tipo);
          }
        });
      break;

    }
  }

  detailSelected(action){
    if(action == "ELIMINAR"){
      let cantidad = 0; 
      for (let item of this.dataSource.data) {
        if(item.select){
          cantidad++;
        }
      }
      if(cantidad < 1){
        swal.fire({
          title:'',
          text:'Debes seleccionar al menos un elemento',
          icon:null
        });
      }else{
        if(cantidad > 1){
          var msg = '¿Eliminarlos de favoritos?';
        }else{
          var msg = '¿Eliminar de favoritos?'
        }
        swal.fire({
          text: msg,
          icon: null,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        })
        .then(result=>{
          if(result.value){
            for(let item of this.datos){
              if(item.select){
                this.deleteFavorite(item.codEncriptado,item.tipo_favorito);
              }
            }
          }
        });
      }
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
