import { Component, OnInit ,ViewChild } from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { currentUser } from '../interface/currentuser.interface';
import { MatPaginator, MatTableDataSource, MatSort, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material';
import swal from 'sweetalert2';
@Component({
  selector: 'app-cuenta-favorito',
  templateUrl: '../templates/cuenta.favorito.template.html',
    styleUrls: ['../css/comentarios.css'],
  //,styleUrls: ['./heroes.component.css']
})
export class CuentaFavoritoComponent implements OnInit {
  error = '';
  sub;
  //FILTROS
  p_filtros={};
  //RESULTADO
  //RESULTADO
  items;
  total_items=0;

  visible_favorito:boolean=false;

  currentuser:currentUser;
  //dataSource;

  ///////// comentario tabla //////
  dataSource: MatTableDataSource<Element>;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /**
   * Pre-defined columns list for user table
   */
  
  columnNames = [{
    id: "clifav_codigo",
    value: "Codigo"
  }, {
    id: "foto_url",
    value: "Foto"
  }, {
    id: "linea_nombre",
    value: "Nombre"
  }, {
    id: "clifav_fecha_creacion",
    value: "Fecha Creacion"
  }, {
    id: "tipo_favorito",
    value: "Tipo"
  }, {
    id: "boton",
    value: ""
  }];


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
    //console.log("userc111",JSON.parse(localStorage.getItem("currentUser")).token)
    //console.log("userc",localStorage.getItem("currentUser"))
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      //this.p_filtros['p_token']= JSON.parse(localStorage.getItem("currentUser")).token;
      this.sendRequest();
      window.scrollTo(0, 0)
    });

    this.displayedColumns = this.columnNames.map(x => x.id);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  deleteFavorito(pcodigo: string,ptipo:string): void {  
    if(ptipo=="USADO")
        this.promiseService.deleteService(
          AppComponent.urlservicio + '?_p_action=_clientefavorito',
          {
            venta_codigo: pcodigo
          }     
        )
          .then(result => {
              swal(
                AppComponent.tituloalertas,
                'Datos Eliminado Correctamente !',
                'success'
              );   
              this.sendRequest()      
          })
          .catch(error => {         
              alert(error._body)            
          });
    else
          //alert(pcodigo)
          //linea_codigo: pcodigo,
          //linea_modelo: panno 
         
        this.promiseService.deleteService(
          AppComponent.urlservicio + '?_p_action=_clientefavorito',
          {
            nuevo_codigo: pcodigo
          }     
        )
          .then(result => {
              swal(
                AppComponent.tituloalertas,
                'Datos Eliminado Correctamente !',
                'success'
              );     
              this.sendRequest()  
          })
          .catch(error => {         
              alert(error._body)            
          });
  }  
  sendRequest(){
    
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
      AppComponent.urlservicio+'?_p_action=_clientefavorito', 
      Object.assign(
        this.p_filtros,
        {
          currentPage : 1,
          sizepage    : AppComponent.paginasize
        }
      )
    )
    .then(result => {
      this.items=result.datos;
      this.total_items=result.registros
      //this.setPage(1);
      this.createTable();

      if (this.total_items >0){
          this.visible_favorito=true;
       
      }else{
        this.visible_favorito=false;
      }
    })
    .catch(error => {
        this.error=error._body;
       // console.log("ERRRORRR",error._body)
    }); 
  }
  detail(pcodigo:string,ptipo:string,panno:string):void{
    if(ptipo=="USADO")  this.router.navigate(['clasificados/detalle',pcodigo])    
    else this.router.navigate(['nuevo/detalle',pcodigo])        
  }
  createTable() {
    let tableArr: Element[];
    this.dataSource = new MatTableDataSource(tableArr);
    for (let o of this.items) {
      this.dataSource.data.push(
        {
          clifav_codigo: o.clifav_codigo,
          clifav_fecha_creacion: o.clifav_fecha_creacion,
          linea_nombre: o.linea_nombre,
          foto_url: o.foto_url,
          tipo_favorito: o.tipo_favorito,
          boton: "",
          codigointerno:o.codigointerno
        }
      );
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sort = this.sort;
  }
  


 
}

export interface Element {
  clifav_codigo: number,
  clifav_fecha_creacion:string,
  linea_nombre:string,
  foto_url:ImageData,
  tipo_favorito:string ,
  boton:string,
  codigointerno:string
/*
  picture: ImageData,
  name: string,
  //fecha: string,
  //finaliza: string,
  //boton:string,
  visitas: string,
  boton: string
*/  
}
