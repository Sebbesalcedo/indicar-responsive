import { Component, OnInit, ViewChild ,ElementRef,PipeTransform,Pipe,AfterContentInit,Inject} from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { currentUser } from '../interface/currentuser.interface';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { JsonPipe } from '@angular/common';
import {ExcelService} from '../servicios/ExcelService .servicio';
import { NgxDateRangePickerOptions } from 'ngx-daterangepicker';
import { CuentaComponent } from '../componentes/cuenta.component';

import * as moment from 'moment';
import 'moment/locale/es'
moment.locale('es')

import { NgxDaterangepickerModule } from '@qqnc/ngx-daterangepicker';

@Component({
  selector: 'app-cuenta-comentario',
  templateUrl: '../templates/cuenta.conversaciones.template.html',
  styleUrls: ['../css/comentarios.css']
})
export class CuentaConversacionesComponent implements OnInit,AfterContentInit {
  error = '';
  sub;
  //FILTROS
  p_filtros = {};
  //RESULTADO
  //RESULTADO
  items;
  items_original;
  total_items = 0;
  Hoy:any='Hoy';
  currentuser: currentUser;

  visible_responder:boolean=false;

  //modal
  mensajeComentario: string = "";
  carroComentario: string = "";
  respuesta:string="";
  p_id:string;

  loading:boolean=false;
  p_estado:string='';
  ///////// comentario tabla //////
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('dpic' ) dpic:any ;
  options: NgxDateRangePickerOptions;
  value_dates:any;
  customRanges:any;
  p_estadoconversacion:any;
  p_textofiltro:string="";
  //@ViewChild('dpicker') child: NgxDateRangePickerComponent ;
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

  getObjJSON(json:string){
    if(json==undefined)return null;
    //alert(json)
   // console.log("DETTTTT",JSON.parse(json))
    return JSON.parse(json);
  }
  applyFilter(filterValue: string) {   
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    let s =  this.items_original.filter(item => 
      Object.keys(item).some(k => item[k] != null && 
      item[k].toString().toLowerCase()
      .includes(filterValue.toLowerCase()))
    );
    this.items=s;  
  }

  filterByEstado(p_estado:string){    
    switch(this.p_estadoconversacion){
      case 'P':
          this.items =  this.items.filter(item => 
            Object.keys(item).some(k => item[k] != null && 
            item["pendientes"].toString().toLowerCase()!="0"
            //.includes(p_estado.toLowerCase())
            )
          ); 
      break;
      case 'L':
          this.items =  this.items.filter(item => 
            Object.keys(item).some(k => item[k] != null && 
            item["pendientes"].toString().toLowerCase()=="0"
            //.includes(p_estado.toLowerCase())
            )
          ); 
      break;  
      default:
          this.items =  this.items.filter(item => 
            Object.keys(item).some(k => item[k] != null && 
              (
                item["pendientes"].toString().toLowerCase()=="0"||
                item["pendientes"].toString().toLowerCase()!="0"
              )  
            
            )
          ); 
       // this.items=this.items_original;
        break;      
    }   
  }
  filterByCodigo(p_codigo:string){    
    
  }

  applyAllfilter(){       
    this.applyFilter(this.p_textofiltro);
    this.filterByEstado(null);
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
    private excelService:ExcelService,
    @Inject(CuentaComponent) private parent: CuentaComponent
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
  AfterViewInit(){
    //this.child.selectRange({alias: 'lm', text: 'Mes Anterior', operation: '-1mt'});
  }
  ngAfterContentInit(){
    //this.child.selectRange({alias: 'lm', text: 'Mes Anterior', operation: '-1mt'});
  }
  onSelectDate(fini:any,ffin:any){
    console.log("fini",fini);
    console.log("ffin",ffin);
  }
  onChange(evt) {
    //alert(evt.value);
    //this.filterByEstado(evt.value);
    this.applyAllfilter();
  }  
  ////// fin modal /////
  ngOnInit() {
    this.p_estadoconversacion='T';
    this.customRanges = [
      {
        text: 'Hoy', desc: 'Hoy', value: 'Hoy',
        start: moment(),
        end: moment(),
        default: true
      },
      {
        text: 'Ultimos 3 Meses', desc: 'Ultimos 3 Meses', value: 'last3month',
        start: moment().subtract(3, 'month').startOf('month'),
        end: moment().subtract(1, 'month').endOf('month')
      },
      {
        text: 'Ultimos 6 Meses', desc: 'Last Month', value: 'lastmonth',
        start: moment().subtract(6, 'month').startOf('month'),
        end: moment().subtract(1, 'month').endOf('month')
      },
      {
        text: 'Este año', desc: 'Este año', value: 'thisyear',
        start: moment().startOf('year'),
        end: moment().endOf('year')
      }/*,
      {
        text: 'Last Year', desc: 'Last Year', value: 'lastyear',
        start: moment().subtract(1, 'year').startOf('year'),
        end: moment().subtract(1, 'year').endOf('year')
      }*/
    ];
    /*
    alert(moment().subtract(1, 'month').startOf('day').format('YYYY').toString())
    alert(moment().subtract(1, 'month').startOf('day').format('M'))
    alert(moment().subtract(1, 'month').startOf('day').format('D'))
    console.log("MOMNET",moment().subtract(6, 'month').startOf('month').format('YYYY'));*/
    
    this.options = {
      theme: 'default',
      labels: ['Start', 'End'],
      menu: [
          {alias: 'td', text: 'Hoy', operation: '0d'},
          {alias: 'lyt', text: 'Mes anterior desde hoy', operation: '-1mt'},
          {alias: 'tm', text: 'Este Mes', operation: '0m'},
          {alias: 'lm', text: 'Mes Anterior', operation: '-1m'},
          {alias: 'tw', text: 'Esta Semana', operation: '0w'},
          {alias: 'lw', text: 'Semana Anterior', operation: '-1w'},
          //{alias: 'ty', text: 'Este Año', operation: '0y'},
          //{alias: 'ly', text: 'Año Anterior', operation: '-1y'},
          //{alias: 'ny', text: 'Next Year', operation: '+1y'},
          {alias: 'lyt', text: 'Mes anterior apartir de hoy', operation: '-1mt'}
      ],
      dateFormat: 'YYYY-MM-DD',
      outputFormat: 'YYYY-MM-DD',
      startOfWeek: 0,
      outputType: 'object',
      locale: 'es',
      date: {
          from: {
              year: Number(moment().subtract(1, 'month').startOf('day').format('YYYY').toString()),
              month: Number(moment().subtract(1, 'month').startOf('day').format('M').toString()),
              day: Number(moment().subtract(1, 'month').startOf('day').format('D').toString())
          },
          to: {
            year: Number(moment().subtract(0, 'month').startOf('day').format('YYYY').toString()),
            month: Number(moment().subtract(0, 'month').startOf('day').format('M').toString()),
            day: Number(moment().subtract(0, 'month').startOf('day').format('D').toString())
          }
      }
    };
    let desde:string= moment().subtract(1, 'month').startOf('day').format('YYYY').toString()+'-'+
                      moment().subtract(1, 'month').startOf('day').format('MM').toString()+'-'+
                      moment().subtract(1, 'month').startOf('day').format('DD').toString();
    let to:string= moment().subtract(0, 'month').startOf('day').format('YYYY').toString()+'-'+
                      moment().subtract(0, 'month').startOf('day').format('MM').toString()+'-'+
                      moment().subtract(0, 'month').startOf('day').format('DD').toString();                  
    /*this.p_filtros['p_fechas'] = {
      from: desde,
      to:to
    } ; */
    this.p_filtros['p_fini'] = desde; 
    this.p_filtros['p_ffin'] = to; 
    this.value_dates={
      from: desde,
      to:to
    } ;    
    


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
    
    this.p_estado='';   
    if (this.route.snapshot.paramMap.get('p_estado') != null) {
      this.p_id=this.route.snapshot.paramMap.get('p_estado');
      //alert(this.route.snapshot.paramMap.get('id'))
      this.p_filtros['p_estado'] = this.route.snapshot.paramMap.get('p_estado');     
    }



    this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
    this.sub = this.route
      .queryParams
      .subscribe(params => {        
        window.scrollTo(0, 0);
        this.sendRequest(true);
    });
    this.displayedColumns = this.columnNames.map(x => x.id); 
   
    /*
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //As January is 0.
    let yyyy = today.getFullYear();
    let d=dd+'';
    let m=mm+'';
    if(dd<10) d='0'+String(dd);
    if(mm<10) m='0'+mm;
    
    this.options = {
      theme: 'default',
      labels: ['Inicio', 'Fin'],      
      menu: [
          {alias: 'td', text: 'Hoy', operation: '0d'},
          {alias: 'tm', text: 'Mes Catual', operation: '0m'},
          {alias: 'lm', text: 'Mes Anterior', operation: '-1m'},
          {alias: 'tw', text: 'Semana Actual', operation: '0w'},
          {alias: 'lw', text: 'Semana Anterior', operation: '-1w'},
          {alias: 'ty', text: 'Año Actual', operation: '0y'}
          //,          {alias: 'ly', text: 'Año Anterior', operation: '-1y'},
          //{alias: 'ny', text: 'Año Siguiente', operation: '+1y'}
          //,          {alias: 'lyt', text: 'Last year from today', operation: '-1yt'},
      ],
      dateFormat: 'YYYY-MM-DD',
      outputFormat: 'DD-MM-YYYY',
      startOfWeek: 0,
      outputType: 'object',
      locale: 'es',
      date: {
          from: {
              year: yyyy,
              month: mm,
              day: dd
          },
          to: {
            year: yyyy,
            month: mm,
            day: dd
          }
      }
    };

    this.value_dates={
      from: dd+"-"+mm+"-"+yyyy,
      to:dd+"-"+mm+"-"+yyyy
    }
    console.log("child",this.child);*/
   
    //this.child.selectRange({alias: 'tm', text: 'Mes Catual', operation: '0m'});
    
  }
  search():void{
    //console.log("Search",this.value_dates);
    this.p_filtros['p_fini'] = this.value_dates.from; 
    this.p_filtros['p_ffin'] = this.value_dates.to; 
    this.sendRequest();
    //this.child.prevMonth();
   
  }
  detail_selected(operacion:string):void{

  }
  exportAsXLSX():void {
    let data_xls:any=[];
    let cnt_select=0;
    /*let data:any = [{
      eid: 'e101',
      ename: 'ravi',
      esal: 1000
      },{
      eid: 'e102',
      ename: 'ram',
      esal: 2000
      },{
      eid: 'e103',
      ename: 'rajesh',
      esal: 3000
      }];
    */
    for (let o of this.items) { 
      if(o.select){
        data_xls.push({
          nombre:o.conv_nombre,
          correo:o.conv_correo,
          telefono:o.conv_telefono,
          fecha:o.fultimamod,
          placa:o.venta_matricula_placa
        });
        cnt_select++;
      }        
    } 
    if(cnt_select==0){
      swal(
        'Indicar',
        'Debe seleccionar por lo menos una conversación !',
        'info'
      ); 
    } else{
      this.excelService.exportAsExcelFile(data_xls, 'sample');
    } 
    
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ///////// comentario tabla ////////
  onEdit(obj: any) {
    this.mensajeComentario = obj.comentario;
    this.carroComentario = obj.name;
    //console.log("LOG123",obj);
    //console.log("LOG456",obj2);

    this.enviarMensaje(
      obj.linea_nombre,
      obj.ventmens_nombre,
      '',
      '',
      obj.venta_codigo,
      obj.ventmens_correo,
      obj.ventmens_telefono,
      obj.ventmens_correo,
      obj.isown
    )
    return;
    /*
    if(obj.isown=='N')
      this.enviarMensaje(
        obj.linea_nombre,
        obj.cliente_nombrecompleto,
        '',
        '',
        obj.venta_codigo,
        obj.cliente_correo,
        obj.cliente_telefonocelular,
        obj2.ventmens_correo,
        obj.isown
      )
    else
      this.enviarMensaje(
        obj.linea_nombre,
        obj2.ventmens_nombre,
        '',
        '',
        obj.venta_codigo,
        obj2.ventmens_correo,
        obj2.ventmens_telefono,
        obj2.ventmens_correo,
        obj.isown
      )  
   */ 
  }

  enviarMensaje(
    plinea:string,
    pde:string,
    pcomentario:string,
    pcodmensaje:string,
    pcodventa:string,
    pcorreo:string,
    ptelefono:string,
    p_correocliente:string,
    p_isown:string
  ){
    swal({      
      input:'textarea',
      html:
      '<div class="titulo-comentarios">'+
        '<p> Vehiculo:' + plinea +'</p>'+
        '<div class="row">'+
          '<p class="col pl-0" style="text-transform: capitalize;">'+'<b>'+ pde + '</b>'+'<p/>'+
          '<p class="mr-3 text-right">'+'<i class="material-icons msjComent" style="float:inherit">email</i>'+pcorreo+'</p>'+
          '<p class="text-right">'+'<i class="material-icons msjComent" style="float:inherit">phone</i>'+ptelefono+'</p>'+
        '</div>'+       
        //'<div style="margin-left:1rem">'+
        // '<i class="material-icons msjComent">message</i>'+
        //  '<p >'+pcomentario +'</p>'+
        //'</div>'+
      '</div>',           
      text: '',
      width:'60rem',
      /*imageUrl: 'https://placeholder.pics/svg/300x1500',
      imageWidth: 70,
      imageHeight: 70,
      imageAlt: 'Custom image',*/
      animation: true,
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
          'Debe digitar un mensaje !',
          'info'
        ); 
        return;
      }
      if (result.value) {
        this.promiseService.updateService(
          AppComponent.urlservicio + '?_p_action=_cuenta_comentario1',
          {
            p_operacion: 'SENDRESPUESTA',
            p_mensaje: result.value,
            p_codigo: pcodmensaje,
            p_venta_codigo:  pcodventa,
            p_correocliente:p_correocliente,
            p_isown:p_isown
          }
        )
          .then(result => {
            swal(
              'Indicar',
              'Tu mensaje ha sido enviado !',
              'success'
            );   
            this.sendRequest(); 
          })
          .catch(error => { alert(error._body) });            
      }
    });
  }

  sendRequest(isInit:boolean=false) {
    this.parent.setLoading(true);
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
      AppComponent.urlservicio + '?_p_action=_cuenta_conversacion1',
      Object.assign(
        this.p_filtros,
        {
          currentPage: 1,
          sizepage: AppComponent.paginasize
        }
      )
    )
      .then(result => {
        this.parent.setLoading(false);      
        this.items_original =result.datos;
        this.items = result.datos;
        this.total_items = result.registros;        
        for (let o of this.items) { 
          o.select=false;
        } 
        this.items_original = this.items;        
        if (this.total_items >0){
          this.visible_responder=true;          
        }else{
          this.visible_responder=false
        }
        //this.setPage(1);
      })
      .catch(error => {
        this.parent.setLoading(false);
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
        'No se puede enviar un mensaje vacio.',
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

      })
      .catch(error => { alert(error._body) });
    
  }
  public sendVisto(rec:any,index:number) {
    console.log("Rec",rec);
    console.log("I",index);

    this.promiseService.updateService(
      AppComponent.urlservicio + '?_p_action=_cuenta_conversacion1',
      {
        p_operacion: 'SENDVISTO',
        p_codigo: rec.ventconv_codigo
      }
    )
      .then(result => {
        this.items[index].pendientes='0';
        //rec.pendientes=0;
      })
      .catch(error => { alert(error._body) });    
  }
  sendVistoEliminar():void {
    let data_conversaciones:any=[];
    let cnt_select=0;    
    for (let o of this.items) { 
      if(o.select){
        data_conversaciones.push({
          codigo:o.ventconv_codigo,
          index:cnt_select
        });
        cnt_select++;
      }        
    } 
    if(cnt_select==0){
      swal(
        'Indicar',
        'Debe Seleccionar por lo menos una conversación !',
        'info'
      ); 
    } else{
      swal({
        title: '¿ Está seguro ?',
        text: "De Eliminar las conversaciones Seleccionados ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          this.promiseService.updateService(
            AppComponent.urlservicio + '?_p_action=_cuenta_conversacion1',
            {
              p_operacion: 'SENDDELETE',
              p_codigo:JSON.stringify(data_conversaciones)
            }
          )
            .then(result => {
              this.sendRequest();          
              //this.items[index].pendientes='0';
              //rec.pendientes=0;
            })
            .catch(error => { alert('a');alert(error._body) });  
           
        }
      })
       
     
      //this.excelService.exportAsExcelFile(data_xls, 'sample');
    }     
  }

  sendMensajeRespuesta(rec:any,index:number):void {   
      swal({
        title: '¿ Está seguro ?',
        text: "¿ Enviar Mensaje ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar'
      }).then((result) => {
        if (result.value) {
          this.promiseService.updateService(
            AppComponent.urlservicio + '?_p_action=_cuenta_conversacion1',
            {
              p_operacion: 'SENDMENSAJE',
              p_codigo: rec.ventconv_codigo,
              p_mensaje: rec.repuesta 
            }
          )
            .then(result => {
              
              swal(
                'Indicar',
                'Mensaje enviado con éxito !',
                'info'
              ); 
              this.items[index].ldetalle=result.datos;
              this.sendMail(rec);
              this.items[index].repuesta='';
              //this.sendRequest();          
              //this.items[index].pendientes='0';
              //rec.pendientes=0;
            })
            .catch(error => { alert(error._body) });  
           
        }
      })
  }
  sendMail(rec:any):void {   
    this.promiseService.updateService(
      AppComponent.urlservicio + '?_p_action=_cuenta_conversacion1',
      {
        p_operacion: 'SENDMAIL',
        p_codigo: rec.ventconv_codigo,
        p_mensaje: rec.repuesta 
      }
    )
      .then(result => {
              
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
/*export interface NgxDateRangePickerOptions {
  theme: 'default' | 'green' | 'teal' | 'cyan' | 'grape' | 'red' | 'gray';
  range?: string;
  locale?: string;
  labels: string[];
  menu: NgxMenuItem[];
  dateFormat: string;
  outputFormat: string;
  startOfWeek: number;
  outputType?: 'string' | 'object';
  date?: NgxDateRangePickerDates;
}

export interface NgxDateRangePickerDates {
  from: Date | {
      year: number,
      month: number,
      day: number
  };
  to: Date | {
      year: number,
      month: number,
      day: number,
  };
}*/