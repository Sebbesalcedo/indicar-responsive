import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { currentUser } from '../interface/currentuser.interface';
import { MatPaginator, MatTableDataSource, MatSort, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { CuentaComponent } from '../componentes/cuenta.component';
import { EncryptService } from '../servicios/encrypt.service'

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1500,
  hideDelay: 500,
  touchendHideDelay: 500,
};

@Component({
  selector: 'app-cuenta-clasificado',
  templateUrl: '../templates/cuenta.clasificado.template.html',
  styleUrls: ['../css/comentarios.css'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }
  ],
})

export class CuentaClasificadoComponent implements OnInit {
  error = '';
  sub;

  subtitulo="";
  //FILTROS
  p_filtros = {};
  //RESULTADO
  //RESULTADO
  items;
  total_items=0;
  currentuser: currentUser;
  visible_ver:boolean=false;
  visible_editar:boolean=false;
  visible_anular:boolean=false;
  visible_reactivar:boolean=false;
  visible_vendido:boolean=false;
  visible_eliminar:boolean=false;
  codigoalt:any;
  
  ///////// comentario tabla //////
  dataSource: MatTableDataSource<Element>;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  /**
   * Pre-defined columns list for user table
   */
  columnNames = [{
    id: "select",
    value: "select"
  },{
    id: "cod",
    value: "Cod"
  },
   {
    id: "picture",
    value: "Publicación"
  }, {
    id: "name",
    value: ""
  },
  {
    id: "venta_matricula_placa",
    value: ""
  },
  {
    id: "ano_modelo",
    value: ""
  },
  {
    id: "venta_kilometraje",
    value: ""
  }, {
    id: "visitas",
    value: "Visitas"
  },
  {
    id: "boton",
    value: ""
  } 
  
  ];

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  ///////// fin comentario tabla ///////
    
  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private Encrypt: EncryptService,
    @Inject(CuentaComponent) private parent: CuentaComponent
  ) { }
  ngOnInit() {
    /*
    this.currentuser = JSON.parse(localStorage.getItem("currentUser"));    
    this.sub = this.route
      .queryParams
      .subscribe(params => {

        //console.log("p_estado",params['p_estado'])
        //this.p_filtros['p_token']= JSON.parse(localStorage.getItem("currentUser")).token;
        this.sendRequest();
        window.scrollTo(0, 0)
      });
    */
      //this.rowData = this.http.get('https://api.myjson.com/bins/15psn9');
      //alert('a')
     
    this.sub = this.route
      .params
      .subscribe(params => {
        this.p_filtros['p_estado'] = params["p_estado"];

        this.sendRequest();        
        window.scrollTo(0, 0)
      });

    this.displayedColumns = this.columnNames.map(x => x.id);
    console.log("no-entre", this.total_items);
  }
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onEdit(obj: any) {
    obj.classleido = "leido";

  }
  sendRequest() {
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
      AppComponent.urlservicio+'?_p_action=_getClasificados',
      Object.assign(
        this.p_filtros,
        {
          currentPage: 1,
          sizepage: AppComponent.paginasize
        }
      )
    )
      .then(result => {
        this.items = result.datos;
        // console.log(this.items);
        this.total_items = result.registros
        this.createTable();       
        // console.log("estos datos", this.total_items )
        //this.setPage(1);
        this.parent.getinfo();
        if (this.total_items >0) {
            if(this.p_filtros['p_estado']=='P'){          
              this.visible_ver=true;
              this.visible_editar=true;
              this.visible_anular=false;
              this.visible_reactivar=false;
              this.visible_vendido=false;
              this.visible_eliminar=true;
              this.subtitulo="en aprobación";
            }
            if(this.p_filtros['p_estado']=='A'){          
              this.visible_ver=true;
              this.visible_editar=true;
              this.visible_anular=true;
              this.visible_reactivar=false;
              this.visible_vendido=true;
              this.visible_eliminar=true;
              this.subtitulo="aprobados";
            }
            if(this.p_filtros['p_estado']=='R'){          
              this.visible_ver=true;
              this.visible_editar=true;
              this.visible_anular=false;
              this.visible_reactivar=false;
              this.visible_vendido=false;
              this.visible_eliminar=true;
              this.subtitulo="rechazados";
            }
            if(this.p_filtros['p_estado']=='I'){          
              this.visible_ver=true;
              this.visible_editar=true;
              this.visible_anular=false;
              this.visible_reactivar=true;
              this.visible_vendido=false;
              this.visible_eliminar=true;
              this.subtitulo="inactivos";
            }
            if(this.p_filtros['p_estado']=='V'){          
              this.visible_ver=true;
              this.visible_editar=false;
              this.visible_anular=false;
              this.visible_reactivar=false;
              this.visible_vendido=false;
              this.visible_eliminar=true;
              this.subtitulo="vendidos";
            }
        }else{
              this.visible_ver=false;
              this.visible_editar=false;
              this.visible_anular=false;
              this.visible_reactivar=false;
              this.visible_vendido=false;
              this.visible_eliminar=false;

              if(this.p_filtros['p_estado']=='P'){                          
                this.subtitulo="en aprobación";
              }
              if(this.p_filtros['p_estado']=='A'){                          
                this.subtitulo="aprobados";  
              }
              if(this.p_filtros['p_estado']=='R'){                          
                this.subtitulo="rechazados";  
              }
              if(this.p_filtros['p_estado']=='I'){                         
                this.subtitulo="inactivos";
              }
              if(this.p_filtros['p_estado']=='V'){                          
                this.subtitulo="vendidos";
              }

              let tableArr: Element[];
              this.dataSource = new MatTableDataSource(tableArr);
                this.dataSource.data.push(
                  {
                    select:false,
                    cod: null,
                    codEncriptado: null,
                    picture: null,
                    name: "No hay clasificados",
                    visitas: null,
                    boton: "",
                    venta_matricula_placa:null,
                    venta_kilometraje:null,
                    ano_modelo: null
                  }
                );
        }
      })
      .catch(error => {
        this.error = error._body;
        // console.log("ERRRORRR",error._body)
      });
  }
  updateEstado(pcodigo:number,pestado: string) {
    // console.log(this.Encrypt.desencrypt(pcodigo,len));
    this.promiseService.updateService(
      AppComponent.urlservicio + '?_p_action=_getClasificados',
      {
        pestado: pestado,
        venta_codigo: this.Encrypt.desencrypt(pcodigo.toString()),
        p_operacion: 'UPDATEESTADO'
      }
    )
      .then(result => {
        swal(
          AppComponent.tituloalertas,
          'Datos actualizados correctamente !',
          'success'
        );   
        this.sendRequest()    ;
        //alert('aaaa')
       // this.parent.sendRequest();
      })
      .catch(error => {
        alert(error._body)        
      });
  }
  detail(pcodigo: string, poperacion: string,admin:boolean): void {
    // console.log("CODIGO",pcodigo,admin);
    switch (poperacion) {
      case "VER": {
        this.router.navigate(['clasificados/detalle',pcodigo], { queryParams: { p_admin: true } });
        // this.router.navigate(['clasificados/detalle',pcodigo]);        
        break;
      }
      case "EDITAR": {
        this.router.navigate(['publicar', pcodigo]);
        break;
      }
      case "ANULAR": {

        swal({
          title: '¿ Está seguro?',
          text: "¿ De inactivar el clasificado seleccionado ?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.value) {           
            this.updateEstado(parseInt(pcodigo),'I');
          }
        });

        /*
        let dialogRef = this.dialog.open(DialogConfirmar, {
          width: '300px',
          data: { titulo: "Confirmación", mensaje: "Está seguro de inactivar este clasificado? ", pcodigo: pcodigo }
        });
        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed', result);
          if (result != undefined) {
            this.updateEstado(result,'I')
          }
          //this.animal = result;
        });*/
        break;
      }
      case "REACTIVAR": {
        let dialogRef = this.dialog.open(DialogConfirmar, {
          width: '300px',
          data: { titulo: "Confirmación", mensaje: "Está seguro de reactivar este clasificado? ", pcodigo: pcodigo }
        });
        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed', result);
          if (result != undefined) {
            this.updateEstado(result,'A')
          }
          //this.animal = result;
        });
        break;
      }
      case "VENDIDO": {
        
        swal({
          title: '¿ Está seguro?',
          text: "¿ De marcar como vendido el clasificado seleccionado ?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.value) {           
            this.updateEstado(parseInt(pcodigo),'V');
          }
        });
        /*
        let dialogRef = this.dialog.open(DialogConfirmar, {
          width: '300px',
          data: { titulo: "Confirmación", mensaje: "Está seguro de marcar como vendido este clasificado ? ", pcodigo: pcodigo }
        });
        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed', result);
          if (result != undefined) {
            this.updateEstado(result,'V')
          }
          //this.animal = result;
        });*/
        break;
      }
      case "ELIMINAR": {
         swal({
          title: '¿ Está seguro?',
          text: "¿ De eliminar el clasificado seleccionado ?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.value) {           
            this.updateEstado(parseInt(pcodigo),'E');
          }
        });
        /*let dialogRef = this.dialog.open(DialogConfirmar, {
          width: '300px',
          data: { titulo: "Confirmación", mensaje: "Está seguro de eliminar este clasificado? ", pcodigo: pcodigo }
        });
        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed', result);
          if (result != undefined) {
            this.updateEstado(result,'E')
          }
          //this.animal = result;
        });*/
        break;
      }
      default: {
        this.router.navigate(['clasificados/detalle'], { queryParams: { p_codigo: pcodigo } });
        break;
      }
    }
    //this.router.navigate(['clasificados/detalle'], { queryParams: { p_codigo:pcodigo  } });    
  }

  detail_selected( poperacion: string): void {  
    let operacionMsg='';
    switch (poperacion) {
      case "ANULAR": {
        operacionMsg='Inactivar'
        break;
      }
      case "REACTIVAR": {
        operacionMsg='Reactivar'
        break;
      }
      case "VENDIDO": {
        operacionMsg='marcar como vendido';
        break;
      }
      case "ELIMINAR": {
        operacionMsg='eliminar';
        break;
      }
    }  
  
    swal({
      title: 'Está seguro?',
      text: "De "+operacionMsg+" los clasificados seleccionados?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        for (let o of this.dataSource.data) { 
          switch (poperacion) {
            case "ANULAR": {                             
                if(o.select)
                   this.updateEstado(o.codEncriptado,'I')             
              break;
            }
            case "REACTIVAR": {                             
              if(o.select)
                 this.updateEstado(o.codEncriptado,'A')             
              break;
            }
            case "VENDIDO": {
                if(o.select)
                  this.updateEstado(o.codEncriptado,'V')             
              break;
            }
            case "ELIMINAR": {             
                if(o.select)
                this.updateEstado(o.codEncriptado,'E')             
              break;
            }
          }       
        }  
      }
    })

    //this.router.navigate(['clasificados/detalle'], { queryParams: { p_codigo:pcodigo  } });    
  }

  reload(pcodigo: string): void {
    if (pcodigo == '1') {
      this.router.navigate(['clasificados'], {
        queryParams: {
          p_estado: 'A'
        }
      });
    }
  }
  createTable() {
    let tableArr: Element[];
    this.dataSource = new MatTableDataSource(tableArr);
    //console.log("CLASI333",this.items);
    for (let o of this.items) {   
      this.codigoalt = this.Encrypt.encrypt(o.venta_codigo);
      this.dataSource.data.push(
        {
          select:false,
          cod: o.venta_codigo,
          codEncriptado: this.codigoalt,
          picture: o.fotosventa_ruta,
          name: o.linea_nombre,
          visitas: o.venta_visto,
          boton: "",
          venta_matricula_placa:o.venta_matricula_placa,
          venta_kilometraje:o.venta_kilometraje,
          ano_modelo: o.ano_modelo
        }
      );
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sort = this.sort;
  }
}

@Component({
  selector: 'dialog-confirmar',
  templateUrl: '../dialog/dialog-confirmar.html',
})
export class DialogConfirmar {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmar>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface Element {
  select:boolean,
  cod: number,
  codEncriptado: number,
  picture: ImageData,
  name: string,  
  visitas: string,
  boton: string,
  venta_matricula_placa:string,
  venta_kilometraje:string,
  ano_modelo:string
}



