import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';
// DEPENDENCIAS
import {MatSnackBar} from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-conversaciones',
  templateUrl: './usuario-conversaciones.component.html',
  styleUrls: ['./usuario-conversaciones.component.css']
})
export class UsuarioConversacionesComponent implements OnInit {
  // VARIABLES
  datos:any           = [];
  datos_respaldo:any  = [];
  records:number      = 1;
  cuser:any           = null;

  // logica anterior
  p_id = null;
  p_filtros         = {};
  p_estadoconversacion;
  p_estado;
  sub;

  fechaini;
  fechafin;
  public loading = false;

  constructor(
    private WebApiService:WebApiService,
    private route:ActivatedRoute,
    private snackBar:MatSnackBar
  ){ }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.p_id=this.route.snapshot.paramMap.get('id');
      this.p_filtros['p_codigo'] = this.p_id;
    }
    // this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    this.calculateRangeDate();
    this.p_filtros['p_fini'] = this.fechaini; 
    this.p_filtros['p_ffin'] = this.fechafin; 

    this.p_estadoconversacion='T';



    // this.p_estado='';   
    // if (this.route.snapshot.paramMap.get('p_estado') != null) {
    //   this.p_id= this.route.snapshot.paramMap.get('p_estado');
    //   this.p_filtros['p_estado'] = this.route.snapshot.paramMap.get('p_estado');     
    // }



    // this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
    this.sub = this.route.queryParams.subscribe(params => {        
        window.scrollTo(0, 0);
        this.sendRequest(true);
    });
    // this.displayedColumns = this.columnNames.map(x => x.id); 



    this.sendRequest();
  }

  sendRequest(isInit:boolean=false){
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action: '_cuenta_conversacion1',
      p_codigo: '',
      p_fini: this.fechaini,
      p_ffin: this.fechafin,
      currentPage: 1,
      sizepage: 51
    })
    .subscribe(
      data=>{
        
        this.datos = data.datos;
        this.datos_respaldo = data.datos;
        this.records = data.registros;
      
        for(let item of this.datos){
          item.select = false;
        }
        // console.log(data);
        if(this.p_id != null){
          if( !isNaN(parseInt(this.p_id)) ){
            this.applyFilter(this.p_id.toString(),true);
          }
        }
      },
      error=>{
        console.log(error);
      }
    )
  }


  /**
  * @description    Metodo usado para realizar el calculo de las fechas para obtener los mensajes vigentes.
  * @author         Daniel Bolivar - Debb94, github - daniel.bolivar.freelance@gmail.com
  * @since          03-02-2020
  * @version        1.0.0
  */
  calculateRangeDate(){
    // logica daniel manejo de fechas
    let yearinit;
    let monthinit;
    let dayinit;
    let yearend;
    let monthend;
    let dayend;
    // mes de 31 dia
    let mes31 = [1,3,5,7,8,10,12];

    // let dat = new Date("2019-3-31");
    let dat = new Date();
    let year = dat.getFullYear();
    
    // calculo fechas
    let biciesto = false;
    if( (year%4) == 0 ){ //divisible entre 4
      biciesto = true;
      if(year%100 == 0){ // excepto si es divisible entre 100
        biciesto = false;
        if(year%400 == 0){ //exceptuando aquellos divisibles entre 400, que si lo son.
          biciesto = true;
        }
      }
    }
    // mes inicial
    yearinit = dat.getFullYear();
    monthinit = dat.getMonth()+1;
    dayinit = dat.getDate();

    // mes final
    yearend = dat.getFullYear();
    monthend = dat.getMonth()+1;
    dayend = dat.getDate();
    // console.log(dat,dayinit);

    //menos un mes fecha inicial
    monthinit--;
    if(monthinit <=0){
      monthinit = 12;
      yearinit--;
    }
    if(monthinit<=9){
      if(monthinit == 2){
        // console.log('comprobando biciesto',biciesto);
        // console.log(dayinit);
        if(dayinit>28 && biciesto){
          dayinit = 29;
        }else if(dayinit > 28){
          dayinit = 28;
        }
      }
      if(mes31.indexOf(monthinit) == -1){
        if(dayinit>30){
          dayinit = 30;
        }
      }
      monthinit = "0"+monthinit;
    }
    if(dayinit<=9){
      dayinit = "0"+dayinit;
    }
    // console.log("fecha inicial: ", yearinit+"-"+monthinit+"-"+dayinit);
    //fecha final
    if(dayend<=9){
      dayend = "0"+dayend;
    }
    if(monthend <=9){
      monthend = "0"+monthend;
    }
    this.fechaini = yearinit+"-"+monthinit+"-"+dayinit;
    this.fechafin = yearend+"-"+monthend+"-"+dayend;

    // fin logica manejo de fechas.
  }



  generaTableConversations(data){

  }


  sendVisto(detail,i){
    let body = {
      p_operacion: 'SENDVISTO',
      p_codigo: detail.ventconv_codigo
    };
    this.WebApiService.putRequest(AppComponent.urlService,body,{
      _p_action:'_cuenta_conversacion1'
    })
    .subscribe(
      data=>{
        this.datos[i].pendientes = '0';
      },
      error=>{
        console.log(error);
      }
    );
  }

  sendMensajeRespuesta(rec:any,index:number){
    this.snackBar.open('Enviando Mensaje..', 'Aceptar', {
      duration: 12000
    });
    let body = {
      p_operacion: 'SENDMENSAJE',
      p_codigo: rec.ventconv_codigo,
      p_mensaje: rec.repuesta 
    };

    this.WebApiService.putRequest(AppComponent.urlService,body,{
      _p_action:'_cuenta_conversacion1'
    })
    .subscribe(
      data=>{
        // console.log(data);
        this.snackBar.open('¡Mensaje enviado!', 'Aceptar', {
          duration: 3000
        });
        this.datos[index].ldetalle=data.datos;
        this.datos[index].repuesta='';
      },
      error=>{
        console.log(error);
      }
    );
  }





  /* ########################################################### OPCIONES TOOLBAR CONVERSACIONES ########################################################### */
  detailSelected(opt){
    switch(opt){
      case 'ELIMINAR':
        let selecteds       = [];
        var aux             = 0;
        for (let item of this.datos){
          if(item.select){
            selecteds.push({
              codigo: item.ventconv_codigo,
              index: aux
            });
            aux++;
          }
        }
        if(aux == 0){
          swal.fire({
            title: '',
            icon: null,
            text: '¡Debes seleccionar por lo menos una conversación!'
          });
        }else{
          if(aux > 1){
            var tit = "¿Eliminar conversaciones?";
            var msg = "Conversaciones eliminadas";
          }else{
            var tit = "¿Eliminar convesación?";
            var msg = "Conversación eliminada";
          }
          // confirmacion
          swal.fire({
            text: tit,
            icon: null,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if(result.value){
              let body = {
                p_operacion: 'SENDDELETE',
                p_codigo: JSON.stringify(selecteds)
              };
              this.WebApiService.putRequest(AppComponent.urlService,body,{
                _p_action: '_cuenta_conversacion1'
              })
              .subscribe(
                data=>{
                  
                  this.sendRequest();   
                  this.snackBar.open(msg,null,{
                    duration:3000
                  }); 
                },
                error=>{
                  console.log(error);
                  this.snackBar.open('Ocurrio un error',null,{
                    duration:3000
                  });
                }
              )
            }
          });
        }
      break;
      case 'EXPORTAR':
        let selectedConversation  = [];
        let selectedCodigos       = [];
        var aux           = 0;
        let date          = new Date();
        let dateString    = date.getDate() + "-" +date.getMonth()+"-"+date.getFullYear()+" "+date.getHours()+"_"+date.getMinutes()+"_"+date.getSeconds();
        for(let item of this.datos){
          if(item.select){
            selectedConversation.push(item.ventconv_codigo);
            selectedCodigos.push(item.venta_codigo);
            aux++
          }
        }
        if(aux == 0){
          swal.fire({
            title: '',
            icon: null,
            text: '¡Debes seleccionar por lo menos una conversación!'
          });
        }else{
          let body = {
            p_codigos_venta:            selectedCodigos,
            p_codigos_conversaciones:   selectedConversation
          }
          let myHeaders = new Headers();

          fetch(AppComponent.urlService+"?_p_action=_excel_conversaciones", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(body),
            headers:myHeaders
          }).then(res =>{return res.blob()})
          .catch(error => console.error('Error:', error))
          .then( response => {
            var objectURL = URL.createObjectURL(response);
            let anchor = document.createElement('a');
            anchor.href = objectURL;
            anchor.download = "conversaciones-"+dateString+".xls";
            anchor.target = '_blank';
            anchor.classList.add('noview');
            document.getElementsByTagName('body')[0].appendChild(anchor);
            anchor.click();
            // window.open(objectURL);
          });
        }
       break;
    }
  }
  /* ########################################################### /OPCIONES TOOLBAR CONVERSACIONES ########################################################### */
  /* ########################################################### BUSQUEDA CONVERSACIONES ########################################################### */
  applyFilter(search,specific=null){
    search = search.toLowerCase();
    this.datos = this.datos_respaldo;
    if(specific){
      let input;
      input = document.querySelector('#input-search');
      input.value = search;
      this.datos = this.datos.filter( x => {return x.ventconv_codigo.toString() == search.toString() });
    }else{
      this.datos = this.datos.filter(x=>{
        var retorno;
        Object.keys(x).forEach(e=>{
          if(x[e].toString().toLowerCase().includes(search)){
            retorno = true;
          }
        });
        if(retorno){
          return x;
        }
      });
    }
  }
  /* ########################################################### /BUSQUEDA CONVERSACIONES ########################################################### */




}
