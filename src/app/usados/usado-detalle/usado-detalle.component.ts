import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation,NgxGalleryImageSize } from 'ngx-gallery';
import 'hammerjs';

// servicios


import { WebApiService } from 'src/app/servicios/web-api.service';
import { EncryptService } from 'src/app/servicios/encrypt.service';
import { EncabezadoComponent } from 'src/app/components/encabezado.component';
// DEPENDENCIAS
import swal from 'sweetalert2';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UsadoDetalleDialog } from 'src/app/dialogs/usado-detalle/usado-detalle.dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-usado-detalle',
  templateUrl: './usado-detalle.component.html',
  styleUrls: ['./usado-detalle.component.css']
})
export class UsadoDetalleComponent implements OnInit {
  
  //variables
  public loading = false;

  //dialogos
  saleOptions:any         = null;
  deleteOptions:any       = null;
  from:string             = null;

  cuser:any               = null;
  datos:any               = [];
  accesorios:any          = [];
  imagenes:any            = [];
  items:any               = [];
  viewPhone:boolean       = false;
  viewFavorite:boolean    = false;

  p_filtros:any     = [];

  // GALERIA DE IMAGENES
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];


  panelOpenState;
  viewComentario;

  numero=0;
  clasificado;
  
  constructor(
    private WebApiService:WebApiService,
    private route:ActivatedRoute,
    private encrypt:EncryptService,
    private router:Router,
    private snackBar:MatSnackBar,
    private dialog:MatDialog,
    private location: Location,
    @Inject(EncabezadoComponent) public encabezado:EncabezadoComponent,
    
  ){ }
  
  ngOnInit() {
    this.loading = true;
    // recordar desactivar acceso si el clasificado ya no esta disponible y redirigir.
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    this.route.queryParams.subscribe(params=>{
      this.p_filtros['p_admin']   = params.p_admin;
      this.p_filtros['p_codigo']  = this.encrypt.desencrypt(this.route.snapshot.paramMap.get('id'));
    })
    this.sendRequest();
    this.initGallery();
    window.scrollTo(0,0);
    this.clasificado=window.location.href;
    
   
   
  }
  // request
  sendRequest(){
    // VEHICULO
    this.WebApiService.getRequest(AppComponent.urlService,
      Object.assign(
        this.p_filtros,
        {
          _p_action: '_usadodetalle',
        })
    ).subscribe(
      data=>{
        
        this.datos    = data.datos[0];
        if(this.datos.venta_telefonocontacto3==""){
          this.numero=this.datos.venta_telefonocontacto1;
         
        }else{
          this.numero=this.datos.venta_telefonocontacto3;
          
        }
     
        if(this.datos.hasOwnProperty('venta_descripcion')){
          if(this.datos.venta_descripcion != null && this.datos.venta_descripcion != undefined && this.datos.venta_descripcion != ''){
            document.getElementById('comentarios_detalle').innerHTML = this.datos.venta_descripcion;
          }else{
            let panel;
            panel = document.querySelector('.comentario-panel');
            panel.classList.add('noview');
          }
        }
        this.datos.link_codigo = this.encrypt.encrypt(this.datos.venta_codigo);
        this.viewFavorite = true;
        this.loading = false;
      },
      error=>{
        console.log(error);
        this.loading = false;
      }
    );
    // ACCESORIOS O EQUIPAMIENTO
    this.WebApiService.getRequest(AppComponent.urlService,
      {
        _p_action: '_usadodetalleaccesorios',
        p_codigo: this.p_filtros.p_codigo
      }
    )
    .subscribe(
      data =>{
        this.accesorios = data.datos;
      },
      error=>{
        console.log(error);
      }
    );
    // IMAGENES
    this.WebApiService.getRequest(AppComponent.urlService,
      Object.assign(
        this.p_filtros,
        {
          _p_action:'_usadodetalleimagenes'
        }
      )
    )
    .subscribe(
      data=>{
      
        this.imagenes = data.datos;
        this.imagenes.map((image,i)=>{
          this.galleryImages[i] = {
            small: image.fotosventa_ruta, 
            medium: image.fotosventa_ruta,
            big: image.fotosventa_ruta
          }
        })
        window.scrollTo(0,0);
      },
      error=>{
        console.log(error);
    });
  }




  // set favorite
  // phone view

  // si soy propietario 
  // edit
  // delete
  // inactivar
  // notificar venta.

  initGallery(){
    this.galleryOptions = [
      {
        width: '100%',
        height: '100%',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        startIndex:0,
        image:true,
        previewInfinityMove:true,
        imageInfinityMove:true,  
        thumbnailsRows: 1,     
        arrowPrevIcon: 'material-icons',
        arrowNextIcon: 'material-icons',
        closeIcon: 'material-icons',
        // arrowPrevIcon: "fa fa-arrow-circle-o-left", 
        // arrowNextIcon: "fa fa-arrow-circle-o-right",
        previewAnimation: false,
        previewCloseOnEsc: true,
        thumbnailsArrows: true,
        thumbnailsPercent: 30,
        imagePercent:100,
        imageSize: NgxGalleryImageSize.Contain,
        thumbnailsSwipe: true,
        previewSwipe: true,
        previewKeyboardNavigation: true,
        previewZoom :true,
        previewZoomMax :4,
        previewZoomMin :2
      },
      // { "arrowPrevIcon": "fa fa-arrow-circle-o-left", "arrowNextIcon": "fa fa-arrow-circle-o-right", "closeIcon": "fa fa-window-close", "fullscreenIcon": "fa fa-arrows", "spinnerIcon": "fa fa-refresh fa-spin fa-3x fa-fw", "previewFullscreen": true }
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '100%',
        imagePercent: 80,
        thumbnailsPercent: 35,
        thumbnailsMargin: 20,
        thumbnailMargin: 10,
        imageSize: 'contain'
      },
      // max-width 400
      {
        thumbnailsColumns: 3,
        breakpoint: 400,
        thumbnailsPercent: 30,
        thumbnailsMargin: 10,
      }
    ];
    this.galleryImages = [];
  }

  viewPhones(){
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.cuser != null){
      this.viewPhone = true;
    }else{
      swal.fire({
        text: "Debe iniciar sesión para poder ver los números de contacto.",
        icon: null,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {     
          let log;
          log = document.querySelector('.login .login');
          log.click();
        }
      });
    }
  }
  /* ########################################################### MENSAJES - PREGUNTA VENDEDOR ########################################################### */
  openDialog(dialog,cod:string = null){
    var dialogRef;
    switch(dialog){
      case 'question': // PREGUNTA AL VENDEDOR
        this.cuser = JSON.parse(localStorage.getItem('currentUser'));
        if(this.cuser != null){
          dialogRef = this.dialog.open(UsadoDetalleDialog,{
            data: {
              window: 'question',
              dialog: 'message',
              codigo_venta: cod
            }
          });
          // LOADING
          dialogRef.componentInstance.loading.subscribe(val=>{
            this.loading = val;
          })
          // CERRAR DIALOGO
          dialogRef.componentInstance.closeDialog.subscribe(val=>{
            this.loading = false;
            this.sendRequest();
            dialogRef.close();
          })
        }else{
          swal.fire({
            text: "Debe iniciar sesión para poder preguntar al vendedor.",
            icon: null,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Iniciar sesión',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.value) {     
              let log;
              log = document.querySelector('.login .login');
              log.click();
            }
          });
        }
      break;
      case 'sold': // REPORTE DE VENDIDO
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
            this.updateStatus('E',cod);
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
      case 'delete': // REPORTAR ELIMINAR
        // motivo de venta.
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
            this.updateStatus('V',cod);
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
    }
  }
  /* ########################################################### /MENSAJES - PREGUNTA VENDEDOR ########################################################### */
  /* ########################################################### ACTUALIZACION DE ESTADO ########################################################### */
  updateStatus(option,cod){
    switch(option){
      case 'V':
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
      break;
      case 'I':
        this.update(cod,option);
      break;
      case 'E':
        if(this.deleteOptions == null){
          // consultar opciones de vendido.
          this.loading = true;
          this.WebApiService.getRequest(AppComponent.urlService,{
            _p_action: '_usadodetalle',
            _p_operacion: 'getDeleteParameters'
          })
          .subscribe(
            data=>{
              this.deleteOptions = data.datos;
              this.loading = false;
              this.openDialog('delete',cod);
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
        // this.update(cod,option);
      break;
    }
  }
  update(cod:number,action:string){
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
        // console.log(data);
        this.snackBar.open('Información actualizada', 'Aceptar', {
          duration: 3000
        });
        if(action == 'I' || action == 'V'){
          this.router.navigate(['/usuario',{outlets: {'cuenta-opcion': ['clasificado',action] } }]);
        }else{
          this.router.navigate(['/usuario',{outlets: {'cuenta-opcion': ['clasificado','P'] } }]);
        }
      },
      error=>{
        console.log(error);
        this.snackBar.open('Error al actualizar', null, {
          duration: 3000
        });
      }
    )
  }
  /* ########################################################### ACTUALIZACION DE ESTADO ########################################################### */
  /* ########################################################### FAVORITOS ########################################################### */
  setFavorito(cod:string,status:string = null){
    event.stopPropagation();
    let setFavorite = JSON.parse(localStorage.getItem('setFavorite'));
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.cuser == null){ // debe iniciar sesion
      swal.fire({
        title: '',
        icon: null,
        text: 'Debe iniciar sesión para agregar a favoritos',
        showCloseButton:      true,
        showCancelButton:     true,
        confirmButtonColor:   '#3085d6',
        cancelButtonColor:    '#d33',
        confirmButtonText:    'Iniciar sesión',
        cancelButtonText:     'Cancelar'
      })
      .then(
        resp =>{
          if(resp.value == true){
            // establezco favorito en localstorage
            let objData = {
              cod:    cod,
              // index:  index,
              // nombre: nombre,
              status: status
            };
            let favorite = JSON.stringify(objData);
            localStorage.setItem('setFavorite',favorite);
            this.encabezado.login();
            let interval = setInterval(function(datos){
              if(JSON.parse(localStorage.getItem('setFavorite'))== null){
                if(status == 'S'){
                  datos.isfavorito = 'N';
                }else{
                  datos.isfavorito = 'S';
                }
                clearInterval(interval);
              }
            },800,this.datos);
          }else{

          }
        }
      )

      // establezco favorito en localstorage
      // let objData = {
      //   cod:    cod,
      //   index:  index,
      //   nombre: nombre,
      //   status: status
      // };
      // let favorite = JSON.stringify(objData);
      // localStorage.setItem('setFavorite',favorite);
      // this.encabezado.login();
      // if(status == 'S'){
      //   this.items[index].isfavorito = 'N';
      // }else{
      //   this.items[index].isfavorito = 'S';
      // }
    }else{  // usuario logueado.
      // let codigo = this.encrypt.desencrypt(cod);
      let body = {
        venta_codigo: cod
      }
      if(status == 'N'){ // agregar a favorito
        this.WebApiService.postRequest(AppComponent.urlService,body,{
          _p_action:'_clientefavorito'
        })
        .subscribe(
          data=>{
            this.datos.isfavorito = 'S';
            this.snackBar.open('¡Agregado a favoritos!', null, {
              duration: 3000
            });
            localStorage.removeItem('setFavorite');
          },
          error=>{
            console.log(error);
          }
        );
      }else{  // eliminar de favoritos.
        this.WebApiService.deleteRequest(AppComponent.urlService,body,{
          _p_action:'_clientefavorito'
        })
        .subscribe(
          data=>{
            this.datos.isfavorito = 'N';
            this.snackBar.open('¡Removido de favoritos!', null, {
              duration: 3000
            });
            localStorage.removeItem('setFavorite');
          },
          error=>{
            console.log(error);
          }
        );
      }
    }
  }
  /* ########################################################### /FAVORITOS ########################################################### */

  backPage(){
    window.history.back();
  }
}
