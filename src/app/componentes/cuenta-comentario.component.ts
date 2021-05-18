import { Component, OnInit, ViewChild ,ElementRef,Inject} from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { currentUser } from '../interface/currentuser.interface';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { EncabezadoComponent } from './encabezado.component';
@Component({
  selector: 'app-cuenta-comentario',
  templateUrl: '../templates/cuenta.comentario.template.html',
  styleUrls: ['../css/comentarios.css']
})
export class CuentaComentarioComponent implements OnInit {
  error = '';
  sub;
  //FILTROS
  p_filtros = {};
  //RESULTADO
  //RESULTADO
  items;
  total_items = 0;
  currentuser: currentUser;

  visible_responder:boolean=false;

  //modal
  mensajeComentario: string = "";
  carroComentario: string = "";
  respuesta:string="";
  p_id:string;
  ///////// comentario tabla //////
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Pre-defined columns list for user table
   */
  columnNames = [{
    id: "cod",
    value: "Cod",

  }, {
    id: "picture",
    value: "Publicación",


  }, {
    id: "name",
    value: "",

  },
  {
    id: "fecha",
    value: "Fecha",

  },
  {
    id: "comentario",
    value: "Comentario",

  },
  {
    id: "boton",
    value: "",

  }];

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;



/*
    swal({
      title: 'Sweet!',
      input:'text',
      html:
      'You can use <b>bold text</b>, ' +
      '<a href="//github.com">links</a> ' +
      'and other HTML tags',
      text: 'Modal with a custom image.',
      //imageUrl: 'https://unsplash.it/400/200',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
      animation: false
    })

    //this.openLg(this.content,this.dataSource.filteredData[0]) ;
    console.log("OCDF",this.dataSource.filteredData[0]);*/
  }
  ///////// fin comentario tabla ///////
  @ViewChild('contentWrapper') content: ElementRef;

  ////// modal /////
  closeResult: string;

  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    @Inject(EncabezadoComponent) private parent: EncabezadoComponent
  ) { }


  openLg(content,row) {
    //console.log("ROW",row);
    this.respuesta=row.ventmens_respuesta;
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.sendMensaje(this.respuesta,row);      
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {      
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ////// fin modal /////
  ngOnInit() {
    
    this.p_id='';   
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.p_id=this.route.snapshot.paramMap.get('id');
      //alert(this.route.snapshot.paramMap.get('id'))
      this.p_filtros['p_codigo'] = this.route.snapshot.paramMap.get('id');
      let c_user = JSON.parse(localStorage.getItem('currentUser'));
      if (c_user != null) {        
      }
      //this.sendRequest();
    }
    this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
    this.sub = this.route
      .queryParams
      .subscribe(params => {        
        this.sendRequest();
        window.scrollTo(0, 0)
    });
    this.displayedColumns = this.columnNames.map(x => x.id); 
    
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ///////// comentario tabla ////////
  onEdit(obj: any) {
    obj.classleido = "leido";
    this.mensajeComentario = obj.comentario;
    this.carroComentario = obj.name;
    console.log("LOG",obj);
    this.enviarMensaje(obj.name,obj.ventmens_nombre,obj.comentario,obj.cod,obj.venta_codigo)
  }

  enviarMensaje(plinea:string,pde:string,pcomentario:string,pcodmensaje:string,pcodventa:string){
    swal({
     // title: 'Comentario',
      // '<p class="mr-3 text-right">'+'<i class="material-icons msjComent" style="float:inherit">email</i>'+'email@hotmail.com'+'</p>'+
      //'<p class="text-right">'+'<i class="material-icons msjComent" style="float:inherit">phone</i>'+'31712345678'+'</p>'+
      input:'textarea',
      html:
      '<div class="titulo-comentarios">'+
        '<p> Vehiculo:' + plinea +'</p>'+
        '<div class="row">'+
          '<p class="col pl-0" style="text-transform: capitalize;">'+'<b>'+ pde + '</b>'+'<p/>'+
        '</div>'+
       
        '<div style="margin-left:1rem">'+
         '<i class="material-icons msjComent">message</i>'+
          '<p >'+pcomentario +'</p>'+
        '</div>'+
      '</div>',           
      text: 'Modal with a custom image.',
      width:'60rem',
      /*imageUrl: 'https://placeholder.pics/svg/300x1500',
      imageWidth: 70,
      imageHeight: 70,
      imageAlt: 'Custom image',*/
      animation: false,
      showCancelButton: true,
      confirmButtonColor: '#003993',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Responder',
      cancelButtonText : 'Cancelar',
      inputClass:'comentario',
      customClass:'text-left'
    }).then((result) => {
      //console.log("RESULT ",result);
      //alert(result.value)
      if(result.value==undefined)return;
      if(result.value==""){
        swal(
          'Indicar',
          'Debe Digitar un mensaje !',
          'info'
        ); 
        return;
      }
      if (result.value) {
        this.promiseService.updateService(
          AppComponent.urlservicio + '?_p_action=_cuenta_comentario',
          {
            p_operacion: 'SENDRESPUESTA',
            p_mensaje: result.value,
            p_codigo: pcodmensaje,
            p_venta_codigo:  pcodventa
          }
        )
          .then(result => {
            swal(
              'Indicar',
              'Tu mensaje ha sido enviado !',
              'success'
            ); 

            this.parent.refreshMensajes();

            if(this.route.snapshot.paramMap.get('id')!=""&&this.route.snapshot.paramMap.get('id')!=null){
              this.router.navigateByUrl('cuenta/(cuenta-opcion:comentario)');
            }else{
              this.sendRequest();
            }  
            
          })
          .catch(error => { alert(error._body) });            
      }
    });
  }

  sendRequest() {
    
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
      AppComponent.urlservicio + '?_p_action=_cuenta_comentario',
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
        this.total_items = result.registros
        this.createTable();


        if (this.total_items >0){

          this.visible_responder=true;

          if(this.route.snapshot.paramMap.get('id')!=""&&this.route.snapshot.paramMap.get('id')!=null){
            
            this.applyFilter(this.route.snapshot.paramMap.get('id'));
            this.enviarMensaje(
              this.dataSource.filteredData[0].name,
              this.dataSource.filteredData[0].ventmens_nombre,
              this.dataSource.filteredData[0].comentario,
              this.dataSource.filteredData[0].cod,
              this.dataSource.filteredData[0].venta_codigo);
            /*swal({
              title: 'Responder Comentario ',
              input:'textarea',
              html:
              'Linea   : <b>' + this.dataSource.filteredData[0].name + '</b>,<br>'+
              'De      : <b>' + this.dataSource.filteredData[0].ventmens_nombre + '</b>,<br>'+
              'Mensaje : <b>' + this.dataSource.filteredData[0].comentario + '</b>,<br>',           
              text: 'Modal with a custom image.',
              //imageUrl: 'https://unsplash.it/400/200',
              imageWidth: 400,
              imageHeight: 200,
              imageAlt: 'Custom image',
              animation: false,
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Responder',
              cancelButtonText : 'Cancelar'
            }).then((result) => {
              console.log("RESULT ",result);
              alert(result.value)
              if(result.value==undefined)return;
              if(result.value==""){
                swal(
                  'Indicar',
                  'Debe Digitar un mensaje !',
                  'info'
                ); 
                return;
              }
              if (result.value) {
                this.promiseService.updateService(
                  AppComponent.urlservicio + '?_p_action=_cuenta_comentario',
                  {
                    p_operacion: 'SENDRESPUESTA',
                    p_mensaje: result.value,
                    p_codigo:  this.dataSource.filteredData[0].cod,
                    p_venta_codigo:  this.dataSource.filteredData[0].venta_codigo
                  }
                )
                  .then(result => {
                    swal(
                      'Indicar',
                      'Tu mensaje ha sido enviado !',
                      'success'
                    );    
                  })
                  .catch(error => { alert(error._body) });            
              }
            });         
            //this.openLg(this.content,this.dataSource.filteredData[0]) ;
            console.log("OCDF",this.dataSource.filteredData[0]);           
            */
          }
        }else{
          this.visible_responder=false
        }
        //this.setPage(1);
      })
      .catch(error => {
        this.error = error._body;
        // console.log("ERRRORRR",error._body)
      });
      
      
  }
  detail(pcodigo: string): void {
    this.router.navigate(['clasificados/detalle'], {
      queryParams: {
        p_codigo: pcodigo
      }
    });
  }
  public sendMensaje(p_mensaje: String,row:any) {
    
    if(p_mensaje==""){
      swal(
        AppComponent.tituloalertas,
        'No se puede enviar una respuesta vacia.',
        'info'
      );
      return;
    }
    

    this.promiseService.updateService(
      AppComponent.urlservicio + '?_p_action=_cuenta_comentario',
      {
        p_operacion: 'SENDRESPUESTA',
        p_mensaje: p_mensaje,
        p_codigo: row.cod,
        p_venta_codigo: row.venta_codigo
      }
    )
      .then(result => {
        swal(
          'Indicar',
          'Tu mensaje ha sido enviado !',
          'success'
        ); 
        this.parent.refreshMensajes();   
      })
      .catch(error => { alert(error._body) });
    
  }
  createTable() {
    let tableArr: Element[];
    this.dataSource = new MatTableDataSource(tableArr);
    for (let o of this.items) {
      this.dataSource.data.push(
        {
          ventmens_respuesta:o.ventmens_respuesta,
          estado_mensaje:o.estado_mensaje,
          venta_codigo:o.venta_codigo,
          cod: o.ventmens_codigo,
          picture: o.fotosventa_ruta,
          name: o.linea_nombre,
          fecha: o.ventmens_fecha_creacion,
          comentario: o.ventmens_contenido,
          boton: "",
          ventmens_nombre:o.ventmens_nombre 
        }
      );
    }
    this.dataSource.sort = this.sort;
  }
}


export interface Element {  
  ventmens_respuesta: string,
  estado_mensaje: string,
  venta_codigo: number,
  cod: number,
  picture: string,
  name: string,
  fecha: string,
  comentario: string,
  boton: string,
}
