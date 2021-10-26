import { Component, OnInit, Inject, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
// SERVICIOS
import { WebApiService } from 'src/app/servicios/web-api.service';
import { EncryptService } from 'src/app/servicios/encrypt.service';
// COMPONENTES
import { EncabezadoComponent } from 'src/app/components/encabezado.component';
// DEPENDENCIAS
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import swal from 'sweetalert2';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UsadoDetalleDialog } from 'src/app/dialogs/usado-detalle/usado-detalle.dialog.component';
import Swal from "sweetalert2";
import { ThemePalette } from "@angular/material/core";
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
@Component({
  selector: 'app-usuario-clasificado',
  templateUrl: './usuario-clasificado.component.html',
  styleUrls: ['./usuario-clasificado.component.css']
})



export class UsuarioClasificadoComponent implements OnInit {
  // VARIABLES
  public loading =  false;
  estado:string             = "";
  records     = 0;
  postType:string;
  datos;
  // configuracion de tabla
  visible_ver       :boolean    = false;
  visible_editar    :boolean    = false;
  visible_reactivar :boolean    = false;
  visible_anular    :boolean    = false;
  visible_eliminar  :boolean    = false;
  visible_vendido   :boolean    = false;

  sub;
  // motivo venta y eliminado
  saleOptions:any               = null;
  deleteOptions:any             = null;
  from:string                   = null;

  list_select: any = [];
  list_add: any = [];
  task: Task = {
    name: "Indeterminate",
    completed: false,
    color: "primary",
    subtasks: [],
  };

  allComplete: boolean = false;


  // TABLA
  dataSource:any          = [];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();


  displayedColumns: string[] = ['select','cod','vehiculo','placa','modelo','visitas','acciones'];

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private WebApiService:WebApiService,
    private Encrypt:EncryptService,
    private snackBar:MatSnackBar,
    private dialog:MatDialog,
    @Inject(EncabezadoComponent) public encabezado:EncabezadoComponent
  ){}

  ngOnInit() {
    // this.postType = this.route.snapshot.paramMap.get('estado');
    this.sub = this.route.params.subscribe(params => {
      this.postType = params['estado'];
      switch(this.postType){
        case 'A':
          this.estado = "aprobados";
          this.visible_ver       = true;
          this.visible_editar    = true;
          this.visible_reactivar = false;
          this.visible_anular    = true;
          this.visible_eliminar  = true;
          this.visible_vendido   = true;
        break;
        case 'P':
          this.estado = "por aprobar";
          this.visible_ver       = true;
          this.visible_editar    = true;
          this.visible_reactivar = false;
          this.visible_anular    = false;
          this.visible_eliminar  = true;
          this.visible_vendido   = false;
        break;
        case 'R':
          this.estado = "rechazados";
          this.visible_ver       = true;
          this.visible_editar    = true;
          this.visible_reactivar = false;
          this.visible_anular    = false;
          this.visible_eliminar  = true;
          this.visible_vendido   = false;
        break;
        case 'I':
          this.estado = "inactivos";
          this.visible_ver       = true;
          this.visible_editar    = true;
          this.visible_reactivar = true;
          this.visible_anular    = false;
          this.visible_eliminar  = true;
          this.visible_vendido   = true;
        break;
        case 'V':
          this.estado = "vendidos";
          this.visible_ver       = true;
          this.visible_editar    = false;
          this.visible_reactivar = false;
          this.visible_anular    = false;
          this.visible_eliminar  = true;
          this.visible_vendido   = false;
        break;
      }
      this.sendRequest();
      window.scrollTo(0, 0)
    });
  }

  sendRequest(){
    this.WebApiService.getRequest(AppComponent.urlService,
      {
        _p_action: '_getClasificados',
        p_estado: this.postType,
        currentPage: 1,
        sizepage: 51
    })
    .subscribe(
      data=>{
        this.datos = data.datos;
        this.records = data.registros;
        if(data.registros > 0){
          this.generateTable(data.datos);
        }
        this.encabezado.getInfoCuenta();
      },
      error=>{
        console.log(error);
      }
    );
  }

  generateTable(data:any){
    data.map(item=>{
      item['select']        = false;
      item['codEncriptado'] = this.Encrypt.encrypt(item.venta_codigo);
    })
    this.dataSource             = new MatTableDataSource(data);
    this.dataSource.paginator   = this.paginator.toArray()[0];
    this.dataSource.sort        = this.sort.toArray()[0];
  }




  applyFilter(filterValue: string) {
    let data = filterValue.trim().toLowerCase();
    this.dataSource.filter = data;
  }

  optionRow(cod,action:string,admin:boolean=null){
    switch (action) {
      case "VER":
        this.router.navigate(['/clasificado/detalle',cod], { queryParams: { p_admin: true } });
      break;
      case "EDITAR":
        this.router.navigate(['/publicar', cod]);
      break;
      case "ANULAR":
        cod = this.Encrypt.desencrypt(cod);
        this.updateEstado(cod,'I');
      break;
      case "REACTIVAR":
        swal.fire({
          text: "¿Reactivar clasificado?",
          icon: null,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.value) {
            cod = this.Encrypt.desencrypt(cod);
            this.updateEstado(cod,'A');
          }
        });
      break;
      case "VENDIDO":
        if(this.saleOptions == null){
          // consultar opciones de vendido.
          this.loading = true;
          this.WebApiService.getRequest(AppComponent.urlService,{
            _p_action: '_usadodetalle',
            _p_operacion: 'getSaleParameters'
          })
          .subscribe(
            data=>{
              this.saleOptions = data.datos;
              this.loading = false;
              this.openDialog('sold',cod);
            },
            error=>{
              this.loading = false;
              this.snackBar.open('Ocurrio un error',null,{
                duration: 3000
              });
            }
          )
        }else{
          this.openDialog('sold',cod);
        }
        // swal.fire({
        //   text: '¿Informar como vendido?',
        //   icon: null,
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Confirmar',
        //   cancelButtonText: 'Cancelar',
        // }).then((result) => {
        //   if (result.value) {
        //     cod = this.Encrypt.desencrypt(cod);
        //     this.updateEstado(cod,'V');
        //   }
        // });

      break;
      case "ELIMINAR":
        // motivo de venta.
         this.loading = true;
        if(this.deleteOptions == null){
          // consultar opciones de vendido.



       cod = this.Encrypt.desencrypt(cod);
        this.updateEstado(cod,'E');

          this.WebApiService.getRequest(AppComponent.urlService,{
            _p_action: '_usadodetalle',
            _p_operacion: 'getDeleteParameters'
          })
          .subscribe(
            data=>{
              this.deleteOptions = data.datos;
              this.loading = false;
            },
            error=>{
              this.loading = false;
              this.snackBar.open('Ocurrio un error',null,{
                duration: 3000
              });
            }
          )
        }else{
          this.openDialog('delete',cod);
        }
      break;
        //  swal.fire({
        //   text: '¿Eliminar clasificado?',
        //   icon: null,
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Confirmar',
        //   cancelButtonText: 'Cancelar',
        // }).then((result) => {
        //   if (result.value) {
        //     cod = this.Encrypt.desencrypt(cod);
        //     this.updateEstado(cod,'E');
        //   }
        // });
      // break;
      default:
        this.router.navigate(['clasificado/detalle'], { queryParams: { p_codigo: cod } });
      break;
    }
  }

  detailSelected( action: string):void {
    let operacionMsg='';
    switch (action) {
      case "ANULAR":
        operacionMsg='Inactivar'
      break;
      case "REACTIVAR":
        operacionMsg='Reactivar'
      break;
      case "VENDIDO":
        operacionMsg='Informar como';
      break;
      case "ELIMINAR":
        operacionMsg='Eliminar';
      break;
    }
    let cantidad = 0;
    let msgEnd = "clasificado";
    for (let item of this.dataSource.data) {
      if(item.select){
        cantidad++;
        if(action == "VENDIDO"){
          msgEnd = "vendido"
        }
        if(cantidad > 1){
          msgEnd = "clasificados";
          if(action == "VENDIDO"){
            msgEnd = "vendidos";
          }
        }
      }
    }
    if(cantidad<1){
      swal.fire({
        title:'',
        text:'Debes seleccionar al menos un clasificado',
        icon:null
      });
    }else{
      swal.fire({
        text: "¿"+operacionMsg+" "+msgEnd+"?",
        icon: null,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.value) {
          for (let item of this.dataSource.data) {
            switch (action) {
              case "ANULAR":
                if(item.select){
                  this.updateEstado(item.venta_codigo,'I');
                }
              break;
              case "REACTIVAR":
                if(item.select){
                  this.updateEstado(item.venta_codigo,'A');
                }
              break;
              case "VENDIDO":
                if(item.select){
                  this.updateEstado(item.venta_codigo,'V');
                }
              break;
              case "ELIMINAR":
                if(item.select){
                  this.updateEstado(item.venta_codigo,'E');
                }
              break;
            }
          }
        }
      });
    }
  }

  openDialog(dialog,cod){
    if(typeof(cod) == "string"){
      cod = parseInt(this.Encrypt.desencrypt(cod));
    }
    var dialogRef;
    switch(dialog){
      case 'delete':
        dialogRef = this.dialog.open(UsadoDetalleDialog,{
          data:{
            window: 'delete',
            deleteOptions: this.deleteOptions,
            codigo_venta: cod
          }
        });
        // LOADING
        dialogRef.componentInstance.loading.subscribe(val=>{
          this.loading = val;
        })
        // CERRAR DIALOGO
        dialogRef.componentInstance.closeDialog.subscribe(val=>{
          if(val == 'sold'){
            dialogRef.close();
            this.from = 'delete';
            this.optionRow(cod,'VENDIDO');
          }else{
            if(val == false){
              dialogRef.close();
              this.from = null;
            }else{
              dialogRef.close();
              this.from = null;
              this.router.navigate(['/usuario',{outlets:{'cuenta-opcion':['clasificado','E']}}]);
            }
          }
        })
      break;
      case 'sold':
         // motivo de venta.
         dialogRef = this.dialog.open(UsadoDetalleDialog,{
          data:{
            window: 'sold',
            saleOptions: this.saleOptions,
            codigo_venta: cod,
            from: this.from
          }
        });
        this.from = null;
        // LOADING
        dialogRef.componentInstance.loading.subscribe(val=>{
          this.loading = val;
        })
        // CERRAR DIALOGO
        dialogRef.componentInstance.closeDialog.subscribe(val=>{
          if(val == 'delete'){
            dialogRef.close();
            this.optionRow(cod,'ELIMINAR');
          }else{
            if(val == false){
              dialogRef.close();
              this.from = null;
            }else{
              dialogRef.close();
              this.router.navigate(['/usuario',{outlets:{'cuenta-opcion':['clasificado','V']}}]);
            }
          }
        })
      break;
    }
  }

  updateEstado(cod:number,action:string){
    let body = {
      pestado: action,
      venta_codigo: cod,
      p_operacion: 'UPDATEESTADO'
    }
    this.WebApiService.putRequest(AppComponent.urlService,body,{
      _p_action:'_getClasificados'
    })
    .subscribe(
      data=>{
        this.snackBar.open('Información actualizada', 'Aceptar', {
          duration: 3000
        });
        this.sendRequest();
        this.encabezado.getInfoCuenta();
      },
      error=>{
        console.log(error);
        this.snackBar.open('Error al actualizar', null, {
          duration: 3000
        });
      }
    )
  }

  updateAllComplete() {
    this.allComplete =
      this.task.subtasks != null &&
      this.task.subtasks.every((t) => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }

    return (
      this.task.subtasks.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  /**
   * Validación de los elementos seleccionados se guardaran en la lista list_select
   * @param completed, true si fue seleccionado, false si fue deseleccionado.
   * @param data , data del elemento de la lista que fue selecionado
   */

  setAll(completed: boolean, data) {
    if (completed) {
      this.list_select.push(data.venta_codigo);
     // console.log(this.list_select);
      this.allComplete = completed;
    } else {
      for (let index = 0; index < this.list_select.length; index++) {
        const element = this.list_select[index];

        if (data.venta_codigo == element) {
          this.list_select.splice(index);
        }
        //console.log(this.list_select);
      }
    }
  }

  cambiarEstado() {

    if(this.dataSource.length==0){

      swal.fire({
        title:'',
        text:'No hay clasificados en la lista.',
        icon:null
      });

    }else{


      if(this.list_select.length==0){

        swal.fire({
          title:'',
          text:'Debes seleccionar al menos un clasificado',
          icon:null
        });


      }else{
        if(this.list_select.length==1){

          swal.fire({
            text: "¿Marcar como vendido?",
            icon: null,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              for (let index = 0; index < this.list_select.length; index++) {
                const element = parseInt(this.list_select[index]);

                this.updateEstado(element, "V");
              }

              this.snackBar.open('Información actualizada', 'Aceptar', {
                duration: 3000
              });
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
            }
          });
        }else{
          swal.fire({
            text: "¿Marcar como vendidos?",
            icon: null,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              for (let index = 0; index < this.list_select.length; index++) {
                const element = parseInt(this.list_select[index]);

                this.updateEstado(element, "V");
              }

              this.snackBar.open('Información actualizada', 'Aceptar', {
                duration: 3000
              });
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
            }
          });
        }



      }


    }






  }


}
