import { Component, OnInit, Pipe, PipeTransform, AfterViewInit, ViewChild, Input, Directive, ElementRef, HostListener  } from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
/*import { SwiperComponent }  from 'angular2-useful-swiper';
declare var Swiper: any;*/
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxGalleryOrder, NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation,  NgxGalleryLayout, NgxGalleryImageSize} from 'ngx-gallery';
import { MatDialog } from '@angular/material';
import { AlertService } from '../servicios/Alert.servicio';
import { EncryptService } from '../servicios/encrypt.service';
import { MatSnackBar } from '@angular/material';

import swal from 'sweetalert2';

import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import {NgBreadcrumbModule, BreadcrumbService} from 'ng-breadcrumb';
//import 'hammerjs';



@Component({
  selector: 'app-usado-detalle',
  templateUrl: '../templates/usado.detalle.template.html',
  styleUrls: ['../css/vitrina.css']
})
export class UsadoDetalleComponent implements OnInit {

  @Input() item;

  //FORMULARIOS
  form_mensaje: FormGroup;
  public mask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  codigo_usuario: string = '';
  correo_usuario: string = '';
  telefono_usuario: string = '';
  nombre_usuario: string = '';

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  sub;
  // EJECUTA CONSULTA
  request:boolean;

  //FILTROS
  p_filtros = {};
  //RESULTADO
  items;
  items_accesorio;
  items_imagenes;
  items_imagenes_total = 100;

  items_relacionados;
  total_items_relacionados = 100;

  total_items = 100;
  items_accesorio_total = 100;

  //alerta
  private _success = new Subject<string>();
  private _successVendido = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;
  vendidoMessage: string;
  public loading = false;

  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder,
    private breadcrumbService: BreadcrumbService,
    private Encrypt: EncryptService,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit() {    
    //<any>$('#glasscase').glassCase({ 'thumbsPosition': 'bottom', 'widthDisplay' : 560});
    //$('glasscase')
    
    //console.log("XXXX",this.child);
    //this.child.glassCase({ 'thumbsPosition': 'bottom', 'widthDisplay' : 560})
    this.init_forms();
    // if (this.route.snapshot.paramMap.get('id') != null) {
      this.request = true;
      this.p_filtros['p_codigo'] = this.Encrypt.desencrypt(this.route.snapshot.paramMap.get('id'));
      this.p_filtros['p_admin']   = this.route.snapshot.queryParamMap.get('p_admin');
      let c_user = JSON.parse(localStorage.getItem('currentUser'));
      if (c_user != null) {
        //console.log("USER",c_user);
        this.form_mensaje.get('correo').setValue(c_user.username);
        this.form_mensaje.get('nombre').setValue(c_user.name);
        this.form_mensaje.get('telefono').setValue(c_user.telefono);
        this.form_mensaje.get('mensaje').setValue('');

        this.codigo_usuario = c_user.codigo;
        this.correo_usuario = c_user.username;
        this.telefono_usuario = c_user.telefono;
        this.nombre_usuario = c_user.name;
      }
      this.sendRequest();
      //alerta
      setTimeout(() => this.staticAlertClosed = true, 20000);

      this._success.subscribe((message) => this.successMessage = message);
      debounceTime.call(this._success, 10000).subscribe(() => this.successMessage = null);

      this._successVendido.subscribe((message) => this.vendidoMessage = message);
      debounceTime.call(this._successVendido, 10000).subscribe(() => this.vendidoMessage = null);
      //galeria ngx
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
          previewAnimation: false,
          previewCloseOnEsc: true,
          thumbnailsArrows: true,
          thumbnailsPercent: 30,
          imagePercent:100,
          imageSize: NgxGalleryImageSize.Contain,
          thumbnailsSwipe: true,
          previewSwipe: true,
          previewKeyboardNavigation: true,
         },
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
      window.scroll(0, 0);
    // }
  }
  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  imgages(msaj:string){
    console.log(msaj);
  }

  // comprobar
  setFavorito(pcodigo:string, index: number): void {    
    console.log(pcodigo);
    let cod = this.Encrypt.desencrypt(pcodigo);
    console.log(this.items);
    if(this.items[0].isfavorito=='S'){    
      this.promiseService.deleteService(
        AppComponent.urlservicio + '?_p_action=_clientefavorito',
        {
          venta_codigo: cod
        }
        // this.data_file_otras
      )
        .then(result => {
            // console.log(result.datos)            
            this.items[0].isfavorito = 'N';
        })
        .catch(error => {
            this.items[0].isfavorito = 'S';
            alert(error._body);             
        });

      this.snackBar.open('Removido de favoritos', 'Aceptar', {
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
            this.items[0].isfavorito = 'S';
        })
        .catch(error => {
            this.items[0].isfavorito = 'N';
            alert(error._body)            
        });        
      this.snackBar.open('Agregado a favoritos', 'Aceptar', {
        duration: 3000
      });
    }  
  }
 
  init_forms() {
    this.form_mensaje = this.fb.group({
      correo: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      nombre: new FormControl('', [
        Validators.required
      ]),
      telefono: new FormControl('', [
        Validators.required

      ]),
      mensaje: new FormControl('', [
        Validators.required
      ])
    });
  }
  sendRequest() {    
    this.loading = true;
    this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
      AppComponent.urlservicio + '?_p_action=_usadodetalle',
      Object.assign(
        this.p_filtros
      )
    )
      .then(result => {
        // console.log("datos o filtros enviados", this.p_filtros);
        this.loading = false;
        window.scrollTo(0, 0);
        result.datos[0].venta_codigo_encrypt = this.Encrypt.encrypt(result.datos[0].venta_codigo);
        this.items = result.datos;
        // console.log(this.items);
        this.total_items = result.registros
        //console.log("CC",this.codigo_usuario);
        //console.log("CCREQ",this.items[0].cliente_codigo);
        if(this.total_items==0){
          swal(
            AppComponent.tituloalertas,
            'Clasificado No Disponible!',
            'success'
          );
          this.router.navigate(['/']);
        }  
        if(this.items[0].venta_estado=='P'&&this.codigo_usuario!=this.items[0].cliente_codigo){
          swal(
            AppComponent.tituloalertas,
            'Clasificado No Disponible!',
            'success'
          );
          //this.router.navigate(['/']);
        }
        // console.log("DETALLE",this.total_items)
        //console.log(this.items[0].ficha)
        // ------------------ //  
        // TRAER RELACIONADOS //
        // ------------------ //
        //console.log("AAAA")
        //console.log(this.items[0])
        //console.log(this.items[0].segmento_codigo);
        /*
        this.promiseService.getServiceWithComplexObjectAsQueryString(
        
          AppComponent.urlservicio+'?_p_action=_getItemsUsadoDetalle_Relacionados', 
          Object.assign(
            //this.p_filtros
            {
                p_segmento: this.items[0].segmento_codigo
            }
          )
        )
        .then(result => {
          this.items_relacionados=result.datos;
          this.total_items_relacionados=result.registros
        
        })
        .catch(error => {alert(error._body)}); 
        console.log(this.items)
        */

      })
      .catch(error => { 
        this.loading = false;
        alert(error._body) ;
      });

    //ACCESORIOS
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio + '?_p_action=_usadodetalleaccesorios',

      Object.assign(
        this.p_filtros
      )
    )
      .then(result => {
        this.items_accesorio = result.datos;
        this.items_accesorio_total = result.registros
      })
      .catch(error => { alert(error._body) });
    //FOTOS
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio + '?_p_action=_usadodetalleimagenes',
      Object.assign(
        this.p_filtros
      )
    )
      .then(result => {
        this.items_imagenes = result.datos;
        this.items_imagenes_total = result.registros
        //console.log(this.items[0].ficha)
        // console.log("items_imagenes",this.items_imagenes);
        //PARA ASIGNAR LA FICHA TECNICA 
        this.items_imagenes.map((todo, i) => {
          //this.filtros.clase[i].selected = false;
          this.galleryImages[i] = {

            small: todo.fotosventa_ruta, //'assets/1-small.jpg',
            medium: todo.fotosventa_ruta, //'assets/1-medium.jpg',
            big: todo.fotosventa_ruta // 'assets/1-big.jpg'

          };
        });
      })
      .catch(error => { alert(error._body) });
  }
  reload(): void {
    // this.router.navigate(['usado'], { queryParams: this.p_filtros });
    // this.sendRequest();
  }
  detail(pcodigo: string): void {
    pcodigo = this.Encrypt.encrypt(pcodigo);
    this.router.navigate(['clasificados/detalle'], {
      queryParams: {
        p_codigo: pcodigo
      }
    });
  }
  public notificarVendido(p_codigo: String) {
    this.promiseService.updateService(
      AppComponent.urlservicio + '?_p_action=_usadodetalle',
      {
        p_operacion: 'NOTIFICARESTADO',
        p_codigo: p_codigo
      }
    )
      .then(result => {
        swal(
          'Indicar',
          'Muchas Gracias por informarnos de la venta del vehiculo !',
          'success'
        )

      })
      .catch(error => { alert(error._body) });
  }
  public sendMensaje(p_codigo: String) {
    if(!this.form_mensaje.valid){
      swal(
        AppComponent.tituloalertas,
        'Formulario con Inconsistencias !',
        'info'
      );
      return;
    }
    this.form_mensaje.get("telefono").setValue(this.form_mensaje.get("telefono").value.replace(/\D+/g, ''));
    this.loading = true;
    this.promiseService.updateService(
      AppComponent.urlservicio + '?_p_action=_usadodetalle',
      {
        p_operacion: 'SENDMENSAJE',
        p_codigo: p_codigo,
        form_mensaje: this.form_mensaje.value
      }
    )
      .then(result => {
        swal(
          'Indicar',
          'Tu mensaje ha sido enviado !',
          'success'
        );
        this.form_mensaje.get('mensaje').setValue('');
        this.loading = false;
      })
      .catch(error => { 
        this.loading = false;
        alert(error._body) 
      });
  }


  //alerta
  public changeSuccessMessage() {
    swal(
      'Indicar',
      'Muchas Gracias por informarnos de la venta del vehiculo !',
      'success'
    )
    // this.alertService.clear();
    // this.alertService.success('Gracias por su colaboración, el reporte ha sido enviado con éxito');     
    //this._success.next(`Gracias por su colaboración, el reporte ha sido enviado con éxito`);
  }

  public vendidoSuccessMessage() {
    this._successVendido.next(`Gracias por usar indicar, el reporte ha sido enviado con éxito`);
  }


  //example 
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // ADDED BY DANIEL BOLIVAR
  reportAsSold(pcodigo:string){ // reportar como vendido el clasificado.
    var msg ="Clasificado reportado como vendido";
    this.updateEstadoClasificado(pcodigo,'V',msg);
  }
  reportAsCanceled(pcodigo:string){ // reportar como anulado o anular clasificado.
    var msg ="Clasificado reportado como anulado";
    this.updateEstadoClasificado(pcodigo,'I',msg);
  }

  updateEstadoClasificado(pcodigo:string,pestado: string,msg:string) {
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
          'Indicar',
          msg,
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

  // ENDED ADDED BY DANIEL BOLIVAR

}


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: '../templates/example-dialog.html',
})
export class DialogContentExampleDialog { }