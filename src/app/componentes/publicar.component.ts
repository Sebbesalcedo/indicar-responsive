import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
//import { MdAutocompleteModule } from '@angular/material/autocomplete'

//import {MatFormField,MatFormFieldModule} from '@angular/material/form-field';
import { ImageUploadModule } from "angular2-image-upload"
import { FileHolder, UploadMetadata, ImageUploadComponent } from 'angular2-image-upload';
//import { UploadMetadata } from 'before-upload.interface';


import { lovTipoContrato } from '../clases/lov/lovTipoContrato.class'
import { AppComponent } from '../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { lovCiudades } from '../clases/lov/lovCiudades.class'

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/debounceTime';
//LIBRERIAS PARA EL CARGUE DE LAS IAMGENES
import { ngfModule, ngf } from "angular-file"
import { Subscription } from 'rxjs'
import { HttpClient, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import swal from 'sweetalert2';

import { MatStepper } from '@angular/material';
import { I18NHtmlParser } from '@angular/compiler';
//import { Ng2ImgMaxService } from 'ng2-img-max';
// const EXIF = require('exif-js');
// import { Exif } from 'EXIF';
// import { Exif } from 'exif-js';

// ADDED BY DANIEL BOLIVAR
import { EncryptService } from '../servicios/encrypt.service';
declare var EXIF: any;
declare var loadImage: any;
// END ADDED BY DANIEL BOLIVAR


@Component({
    selector: 'app-publicar',
    templateUrl: '../templates/publicar.template.html',
    styleUrls: ['../css/publicar.css']
})

export class PublicarComponent implements OnInit, AfterViewInit {
    // ADDED BY DANIEL BOLIVAR
    @ViewChild('imag') imgEl: ElementRef;
    data:any;
    output: string;
    allMetaData:any;
    srcBase64:string = "";
    srcBase642:string = "";
    //END ADDED BY DANIEL BOLIVAR

    onlyText = "'^[a-zA-Z]$'";
    p_consecutivo:string;
    sub;
    record;
    isConcesionario;
    isLinear = false;
    p_filtros = {};
    //FORMULARIOS
    form_linea: FormGroup;
    form_contacto: FormGroup;
    form_imagenes: FormGroup;
    form_accesorios: FormGroup;
    form_precio: FormGroup;//Precios
    //ARRAY PARA LAS FOTOS
    data_file_principal = [];
    data_file_otras = [];
    imagenes_otras = [];
    imagenes_principal = [];
    //LISTA DE VALORES
    lovClase: lovTipoContrato[];
    lovMarca: lovTipoContrato[];
    lovFamilia: lovTipoContrato[];
    lovModelo: lovTipoContrato[];
    lovCaja: lovTipoContrato[];
    lovLinea: lovTipoContrato[];
    lovAccesorios;
    lovCiudades: lovCiudades[];
    lovCiudadesMatricula: lovCiudades[];
    lovTelefono: lovTipoContrato[];
    lovAsesor: lovTipoContrato[];
    //IMAGENES
    img_principal = [];
    img_otras = [];

    filteredStates;
    //AUTOCOMPLETE
    filteredOptions: Observable<string[]>;
    //options = ['One', 'Two', 'Three'];
    options;
    options_matricula;
    //UPLOAD IMAGES
    accept = '*'
    files: File[] = []
    progress: number
    //url = 'https://evening-anchorage-3159.herokuapp.com/api/'
    url = AppComponent.urlservicio + '?_p_action=_imagenes'
    hasBaseDropZoneOver: boolean = false
    httpEmitter: Subscription
    httpEvent: HttpEvent<{}>
    sendableFormData: FormData//populated via ngfFormData directive

    //@ViewChild(ImageUploadComponent) child;
    @ViewChild('imagenUploadPrincipal') child: ImageUploadComponent;
    @ViewChild('imagenUploadOtras') child2: ImageUploadComponent;
    // @ViewChild('imag') child3: ElementRef;
    message: string;
    files2: FileHolder[] = [];

    public mask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]


    //public mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/,/\d/, /\d/, /\d/, /\d/]

    public numberMask = createNumberMask({
        prefix: '',
      suffix: ' ' 
        
    });
    public loading = false;

    // Only required when not passing the id in methods
    @ViewChild('stepper') private myStepper: MatStepper;
    totalStepsCount: number;
    constructor(
        private fb: FormBuilder,
        private promiseService: WebApiPromiseService,
        private route: ActivatedRoute,
        private router: Router
        , public HttpClient: HttpClient
        , public snackBar: MatSnackBar
        , public elementRef : ElementRef,
        private Encrypt:EncryptService
        //,private ng2ImgMaxService: Ng2ImgMaxService 
    ) { }

    ngAfterViewInit() {
        this.files2 = this.child.files
        this.form_imagenes.get("imagen_principal").setValue(this.child.files.length);
        this.form_imagenes.get("imagen_otras").setValue(this.child2.files.length);
        console.log("CVB", this.files2);
        this.totalStepsCount = this.myStepper._steps.length;
    }

    goBack(stepper: MatStepper) {
        stepper.previous();
        window.scroll(0, 0);
      }
      goForward(stepper: MatStepper) {
        stepper.next();
        
        window.scroll(0, 0);
      }

    cancel() {
        this.progress = 0
        if (this.httpEmitter) {
            console.log('cancelled')
            this.httpEmitter.unsubscribe()
        }
    }


    uploadFiles(files: File[]): Subscription {
        console.log("Files", files);
        console.log("sendabledata", this.sendableFormData)
        //console.log("url",this.url)
        //this.url="http://siisa_ec.processoft.com.co/sistema/indicar/prueba.php";
        const req = new HttpRequest<FormData>('POST', this.url, this.sendableFormData, {
            reportProgress: true//, responseType: 'text'
        })

        return this.httpEmitter = this.HttpClient.request(req)
            .subscribe(
                event => {
                    this.httpEvent = event

                    if (event instanceof HttpResponse) {
                        delete this.httpEmitter
                        console.log('request done', event)
                    }
                },
                error => console.log('Error Uploading', error)
            )
    }

    filter(val: string): string[] {
        return this.options.ciudad_nombre.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    displayFn(ciudad?: lovCiudades): string | undefined {
        console.log("ciudad", ciudad)
        return ciudad ? ciudad.ciudad_nombre : undefined;
    }

    onUploadStateChanged(state: boolean) {
        console.log("ESTADO CAMBIO", state);    
    }
    getOrientation(pfile, callback) {
        var reader:any,
        target:EventTarget;
        reader = new FileReader();
        reader.onload = (event) => {
    
          var view = new DataView(event.target.result);
    
          if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
    
          var length = view.byteLength,
            offset = 2;
    
          while (offset < length) {
            var marker = view.getUint16(offset, false);
            offset += 2;
    
            if (marker == 0xFFE1) {
              if (view.getUint32(offset += 2, false) != 0x45786966) {
                return callback(-1);
              }
              var little = view.getUint16(offset += 6, false) == 0x4949;
              offset += view.getUint32(offset + 4, little);
              var tags = view.getUint16(offset, little);
              offset += 2;
    
              for (var i = 0; i < tags; i++)
                if (view.getUint16(offset + (i * 12), little) == 0x0112)
                  return callback(view.getUint16(offset + (i * 12) + 8, little));
            }
            else if ((marker & 0xFF00) != 0xFF00) break;
            else offset += view.getUint16(offset, false);
          }
          return callback(-1);
        };
        alert('aaa111');
        reader.readAsArrayBuffer(pfile.slice(0, 64 * 1024));
      }

    @ViewChild('fileInput') myFileInput: ElementRef;

    getFileLater() {
      console.log(this.myFileInput.nativeElement.files[0]);
    }
    // NO USADO SECCION DE CAMPO PERSONALIZADO - INPUT CON EVENTO CHANGE. NO MANEJADO POR ANGULAR
    /*fileChanged(event){
        //variables
        var imageData, canvas, ctx, orientation,width,height,i1,i2,image2,c,sec;
        const image = event.target.files[0];
        var reader = new FileReader();
        var img = new Image();
        
        // logica
        reader.onload = function(){
            imageData = reader.result;
            EXIF.getData(image,function(){
                this.allMetaData = EXIF.getAllTags(this);
                // orientation
                orientation = this.allMetaData.Orientation;
                console.log('orientacion', reader.result);
                // canvas = document.getElementById('canvasImage');
                canvas = document.createElement("canvas");
                canvas.id = "elcanvas";
                ctx = canvas.getContext("2d");
                img.src = reader.result;
                img.onload=function(){
                    width = img.width;
                    height = img.height;
                    canvas.width = width;
                    canvas.height = height;
                    switch (orientation) {
                        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                        case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
                        case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
                        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                        case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
                        case 7: ctx.transform(0, -1, -1, 0, height , width); break;
                        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                        default: break;
                    }
                    ctx.drawImage(img,0,0);                    

                    sec = document.getElementById('canvas-content');
                    sec.appendChild(canvas);
                    c = document.querySelector('#elcanvas');

                    i2 = document.createElement("img");
                    i2.src = c.toDataURL();
                    sec.appendChild(i2);
                }
            });
        }
        reader.readAsDataURL(image);
    }*/
    // END ADDED BY DANIEL BOLIVAR
    // MODIFIED BY DANIEL BOLIVAR
    onUploadFinished_principal(file: FileHolder) {
        // variables
        console.log(file);
        var imageData, canvas, ctx, orientation,width,height,i1,i2,image2,c,im1,sec,clear;
        // const image = event.target.files[0];
        const image = file.file;
        var reader = new FileReader();
        var img = new Image();
        EXIF.getData(image,function(){
            this.allMetaData = EXIF.getAllTags(this);
            orientation = this.allMetaData.Orientation;
            if(orientation > 1){
                swal(
                    AppComponent.tituloalertas,
                    "Carga Negada. Todas las imagenes deben subirse en orientacion 'Horizontal'",
                    'error'
                );
                // alert("Carga Negada. Todas las imagenes deben subirse en orientacion 'Horizontal'");
                // eliminar imagen cargada.
                clear = document.getElementById('ft-principal');
                clear.querySelector('.img-ul-clear.img-ul-button.ng-star-inserted').click();
                // --------------- VOLTEAR IMAGEN ----
                //creacion de canvas.
                /*canvas = document.createElement("canvas");
                canvas.id = "elcanvas";
                ctx = canvas.getContext("2d");
                img.src = file.src;
                img.onload = function(){
                    // LOGICA 1
                    canvas = loadImage.scale(img, {orientation: orientation || 0, canvas: true});
                    file.src = canvas.toDataURL(file.file.type);

                    // im1 = document.getElementById('imagen1');
                    // im1.src = canvas.toDataURL();
                    // im1.style.width = "50%";
                    // ------------------------

                    // LOGICA 2 - CORTA IMAGEN 
                    // width = img.width;
                    // height = img.height;
                    // canvas.width = width;
                    // canvas.height = height;
                    // // roto imagen de acuerdo a la orientacion de la imagen cargada.
                    // switch (orientation) {
                    //     case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                    //     case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
                    //     case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
                    //     case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                    //     case 6: 
                    //         ctx.transform(0, 1, -1, 0, height , 0);
                    //         console.log(canvas.width,canvas.height);
                    //     break;
                    //     // case 6: ctx.transform(0, 1, -1, 0, width , 0); break;
                    //     case 7: ctx.transform(0, -1, -1, 0, height , width); break;
                    //     case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                    //     default: break;
                    // }
                    // ctx.drawImage(img,0,0);        
                    // sec = document.getElementById('canvas-content');
                    // sec.appendChild(canvas);
                    // im1 = document.getElementById('imagen1');
                    // im1.src = canvas.toDataURL();
                    // im1.style.width = "50%";
                    // im1.style.height = "100%";
                }*/
            }
        });
        // end added by Daniel Bolivar
    }
    // END MODIFIED BY DANIEL BOLIVAR

    onUploadFinished_otras(file: FileHolder) {
        // this.form_imagenes.get("imagen_otras").setValue(this.child2.files.length + 1);
        // this.form_imagenes.get("imagen_otras").markAsTouched();
        // this.data_file_otras.push({
        //      src: file.src,
        //      name: file.file.name
        //  });

        // MODIFIED BY DANIEL BOLIVAR - logica creada para orientar fotos correctamente.
        // VARIABLES
        var canvas, imgloader, image, orientation,timeraux,data_file_otras_inside, clear;
        this.form_imagenes.get("imagen_otras").setValue(this.child2.files.length + 1);
        this.form_imagenes.get("imagen_otras").markAsTouched();
        canvas = document.createElement("canvas");
        canvas.id = "canvasOtras";
        image = file.file;
        data_file_otras_inside = this.data_file_otras;
        // LOGICA
        EXIF.getData(image,function(){
            this.allMetaData = EXIF.getAllTags(this);
            orientation = this.allMetaData.Orientation;
            if(orientation > 1){ // si orientacion esta alterada se procesa la imagen para voltearla correctamente
                // alert("Carga Negada. Todas las imagenes deben subirse en orientacion 'Horizontal'");
                swal(
                    AppComponent.tituloalertas,
                    "Carga Negada. Todas las imagenes deben subirse en orientacion 'Horizontal'",
                    'error'
                );
                // ELIMINAR IMAGEN
                clear = document.getElementById('ft-otros');
                clear.querySelector('.img-ul-clear.img-ul-button.ng-star-inserted').click();

                // VOLTEA IMAGEN EN CASO DE Q SE DESEEN ACOMODAR.
                /*imgloader = new Image();
                imgloader.src = file.src;
                imgloader.onload = function(){
                   // this.data_file_otras
                    canvas = loadImage.scale(imgloader, {orientation: orientation || 0, canvas: true});
                    file.src = canvas.toDataURL(file.file.type);
                    data_file_otras_inside.push({
                        src:file.src,
                        name:file.file.name
                    });
                }*/
            }else{ // la imagen esta orientada correctamente, no se procesa.
                data_file_otras_inside.push({
                    src:file.src,
                    name:file.file.name
                });
            }
        });
        // END MODIFIED BY DANIEL BOLIVAR
    }

    resetOrientation(srcBase64, srcOrientation, callback) {
        var img = new Image();	
    
        img.onload = function() {
          var width = img.width,
                height = img.height,
            canvas = document.createElement('canvas'),
                  ctx = canvas.getContext("2d");
            
        // set proper canvas dimensions before transform & export
            if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
          canvas.height = width;
        } else {
            canvas.width = width;
          canvas.height = height;
        }
        
          // transform context before drawing image
            switch (srcOrientation) {
          case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
          case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
          case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
          case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
          case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
          case 7: ctx.transform(0, -1, -1, 0, height , width); break;
          case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
          default: break;
        }
    
            // draw image
        ctx.drawImage(img, 0, 0);
    
            // export base64
            callback(canvas.toDataURL());
      };
    
        img.src = srcBase64;
    }

    checkOrientacion(srcBase64, srcOrientation, callback){
        var img = new Image();	
    
        img.onload = function() {
          var width = img.width,
                height = img.height,
            canvas = document.createElement('canvas'),
                  ctx = canvas.getContext("2d");
            alert(width);
            alert(height);
            
        // set proper canvas dimensions before transform & export
            if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
          canvas.height = width;
        } else {
            canvas.width = width;
          canvas.height = height;
        }
        
          // transform context before drawing image
            switch (srcOrientation) {
          case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
          case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
          case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
          case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
          case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
          case 7: ctx.transform(0, -1, -1, 0, height , width); break;
          case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
          default: break;
        }
    
            // draw image
        ctx.drawImage(img, 0, 0);
    
            // export base64
            callback(canvas.toDataURL());
      };
    
        img.src = srcBase64;
    }

    onRemoved(file: FileHolder) {
        this.form_imagenes.get("imagen_principal").setValue(this.child.files.length);
        for (var i in this.form_imagenes.controls) {
            this.form_imagenes.controls[i].markAsTouched();
        }
    }
    onRemoved_otras(file: FileHolder) {
        this.form_imagenes.get("imagen_otras").setValue(this.child2.files.length);
        for (var i in this.form_imagenes.controls) {
            this.form_imagenes.controls[i].markAsTouched();
        }
    }

    onBeforeUpload = (metadata: UploadMetadata) => {
        console.log("QWER", metadata)
        /* 
       if (this.fileCounter % 2 === 0) {
         metadata.abort = true;
       } else {
         // mutate the file or replace it entirely - metadata.file
         metadata.url = 'http://somewhereelse.com';
       }
   
       this.fileCounter++;
       */
        return metadata;
    };

    ngOnInit() {
        //VALIDACION PARA SABER SI ES UN CONCESIONARIO EL USUARIO  
        let c_user = JSON.parse(localStorage.getItem('currentUser'));
        if (c_user.tipocliente == '02') this.isConcesionario = true;
        else this.isConcesionario = false;
        this.init_forms();
        //VALIDAR SI ESTA EN MODO MODIFICAR
        if (this.route.snapshot.paramMap.get('id') != null) {
            // this.p_consecutivo=this.route.snapshot.paramMap.get('id');
            // this.get_record(this.route.snapshot.paramMap.get('id'))
            console.log(this.route.snapshot.paramMap.get('id'));
            this.p_consecutivo= this.Encrypt.desencrypt(this.route.snapshot.paramMap.get('id'));
            console.log(this.p_consecutivo);
            this.get_record(this.Encrypt.desencrypt(this.route.snapshot.paramMap.get('id')));
        }else{                        
            this.p_consecutivo=null;
            this.sendRequest_change();
        }
        this.sendRequest_init();
    }
    restart(){
        //alert('aaa')
        this.form_linea.reset();
        this.form_contacto.reset();
        this.form_accesorios.reset();
        this.form_precio.reset();
        this.form_imagenes.reset();       
        //this.child.files.
       // this.router.navigate(['/publicar']);
      }
    get_record(id:string){
        this.loading = true;
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_publicar',
            {
                p_consecutivo:id
            }
        )
            .then(result => {
                this.loading = false;
                this.record = result.datos;
                this.form_linea.get('cClase').setValue(this.record[0].clase_codigo);
                this.form_linea.get('cMarca').setValue(this.record[0].marca_codigo);                
                this.form_linea.get('cFamilia').setValue(this.record[0].linea_familia2);
                this.form_linea.get('cModelo').setValue(this.record[0].venta_modelo);
                this.form_linea.get('cCaja').setValue(this.record[0].linea_caja_cambios);
                this.form_linea.get('cLinea').setValue(this.record[0].linea_codigo);
                this.form_linea.get('publicar_nombre').setValue(this.record[0].publicar_autor);
                this.form_linea.get('recibir_alertas').setValue(this.record[0].correo_sugerencias);
                //FORMULARIO CONTACTO
                this.form_contacto.get('ubicacion_vehiculo').setValue(
                    {
                        ciudad_codigo : this.record[0].cc_ciudad_codigo,
                        ciudad_nombre : this.record[0].cc_ciudad_nombre 
                    }    
                );
                this.form_contacto.get('ubicacion_matricula').setValue(
                    {
                        ciudad_codigo : this.record[0].cm_ciudad_codigo,
                        ciudad_nombre : this.record[0].cm_ciudad_nombre 
                    }    
                );
                this.form_contacto.get('vehiculo_placa').setValue(this.record[0].venta_matricula_placa);
                this.form_contacto.get('vehiculo_kilometraje').setValue(this.record[0].venta_kilometraje);
                this.form_contacto.get('vehiculo_comentario').setValue(this.record[0].venta_descripcion);
                this.form_contacto.get('vehiculo_unicopropietario').setValue(this.record[0].venta_unicopropietario);
                this.form_contacto.get('telefono_principal').setValue(this.record[0].clasificado_telefono);
                this.form_contacto.get('telefono_otro').setValue(this.record[0].venta_telefonocontacto2);
                this.form_contacto.get('telefono_adicional').setValue(this.record[0].venta_telefonocontacto3);
                //alert(this.record[0].venta_nombreasesor);
                this.form_contacto.get('nombre_asesor').setValue(this.record[0].venta_nombreasesor);
                this.form_contacto.get('nombre_asesor2').setValue(this.record[0].venta_nombreasesor2);
                //IMAGENES
                this.img_principal = JSON.parse(this.record[0].fp_fotosventa_ruta)
                this.img_otras     = JSON.parse(this.record[0].fo_fotosventa_ruta)
                    
                console.log("IAMGEN PRIN",this.img_principal)
                //console.log("IAMGEN OTRAS",this.img_otras)

               // console.log("CANTAXCAR1",this.img_principal.length)
                this.form_imagenes.get("imagen_principal").setValue(this.img_principal.length);
                this.form_imagenes.get("imagen_principal").markAsTouched();
                this.form_imagenes.get("imagen_otras").setValue(this.img_otras.length);
                this.form_imagenes.get("imagen_otras").markAsTouched();

                //ACCESORIOS
                let accesorios = JSON.parse(this.record[0].accref_codigo);     
                console.log("ACCESRIOS",accesorios)           
                let accesorios_array=[];
                if(accesorios!=null)
                    accesorios.map(res => {accesorios_array.push(String(res))});
                this.form_accesorios.get('publicar_accesorios').setValue(accesorios_array);
                //PRECIO
                this.form_precio.get('precio_venta').setValue(this.record[0].venta_valor);
                
              

                this.p_filtros['p_clase'] = this.record[0].clase_codigo;
                this.p_filtros['p_marca'] = this.record[0].marca_codigo;
                this.p_filtros['p_familia'] = this.record[0].linea_familia2;
                this.p_filtros['p_modelo'] = this.record[0].venta_modelo;
                this.p_filtros['p_linea'] = this.record[0].linea_codigo;
                this.p_filtros['p_caja'] = this.record[0].linea_caja_cambios;
                this.sendRequest_change();
                console.log("RECORD",this.record);
            })
            .catch(error => {
             //   console.log(error)
                this.loading = false;
                alert(error._body);
            });
    }
    init_forms() {
        this.form_linea = this.fb.group({
            cClase: new FormControl('', [
                Validators.required
            ]),
            cMarca: new FormControl('', [
                Validators.required
            ]),
            cFamilia: new FormControl('', [
                Validators.required
            ]),
            cModelo: new FormControl('', [
                Validators.required
            ]),
            cCaja: new FormControl('', [
                Validators.required
            ]),
            cLinea: new FormControl('', [
                Validators.required
            ]),
            publicar_nombre: new FormControl('', [
            ]),
            recibir_alertas: new FormControl('', [
            ])

        });
        /*
            FORMULARIO PARA DATOS DE CONTACTOS DE VENDEDOR Y DATOS DEL VEHICULO
        */
        this.form_contacto = this.fb.group({
            ubicacion_vehiculo: new FormControl('', [
                Validators.required
            ]),
            ubicacion_matricula: new FormControl('', [
               // Validators.required
            ]),
            vehiculo_placa: new FormControl('', [
                Validators.required,
                Validators.maxLength(6)
            ]),
            vehiculo_kilometraje: new FormControl('', [
                Validators.required,
                Validators.maxLength(9)
            ]),
            vehiculo_comentario: new FormControl('', [
            ]),
            vehiculo_unicopropietario: new FormControl('', [
               // Validators.required
            ]),
            telefono_principal: new FormControl('', [
                Validators.required
            ]),
            telefono_otro: new FormControl('', [
                //Validators.required
            ]),
            telefono_adicional: new FormControl('', [
                //Validators.required
            ]),
            nombre_asesor: new FormControl('', [
                //Validators.required
            ]),
            nombre_asesor2: new FormControl('', [
                //Validators.required
            ])
        });
        this.form_contacto.controls.ubicacion_vehiculo.valueChanges.subscribe(value => {
            this.promiseService.getServiceWithComplexObjectAsQueryString(
                AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVCIUDADES',
                {
                    p_filtro: value
                }
            )
                .then(result => {
                    this.lovCiudades = result.datos;
                })
                .catch(error => console.log(error));
        });
        this.form_contacto.controls.ubicacion_matricula.valueChanges.subscribe(value => {
            this.promiseService.getServiceWithComplexObjectAsQueryString(
                AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVCIUDADES',
                {
                    p_filtro: value
                }
            )
                .then(result => {
                    this.lovCiudadesMatricula = result.datos;
                })
                .catch(error => console.log(error));
        });
        /*
            FORMULARIO PARA ACCESORIOS
        */
        this.form_accesorios = this.fb.group({
            publicar_accesorios: new FormControl('', [
                //Validators.required
            ])
        });
        /*
           FORMULARIO PARA IMAGENES
       */
        this.form_imagenes = this.fb.group({
            imagenes: new FormControl(''),
            imagen_principal: new FormControl('', [
                Validators.required,
                Validators.min(1)
            ]),
            imagen_otras: new FormControl('', [
                Validators.required,
                Validators.min(2)
            ])
        });
        /*
            FORMULARIO PARA PRECIO
        */
        this.form_precio = this.fb.group({
            precio_venta: new FormControl('', [
                Validators.required
            ])
        });
    }
    clearFiltros() {
        this.p_filtros['p_marca'] = '';
        this.p_filtros['p_familia'] = '';
        this.p_filtros['p_modelo'] = '';
        this.p_filtros['p_clase'] = '';
        this.p_filtros['p_linea'] = '';
        this.p_filtros['p_caja'] = '';
    }
    onChange(evt) {

       
        //console.log("XXXAAA", evt.source.ngControl.name);
        if (evt.source.ngControl.name == 'cClase') {
            this.p_filtros['p_clase'] = evt.value;

            this.form_linea.get("cMarca").setValue(''); 
            this.form_linea.get("cFamilia").setValue(''); 
            this.form_linea.get("cModelo").setValue('');
            this.form_linea.get("cCaja").setValue('');
            this.form_linea.get("cLinea").setValue('');
            

            this.p_filtros['p_marca'] = '';
            this.p_filtros['p_familia'] = '';
            this.p_filtros['p_modelo'] = '';
            this.p_filtros['p_linea'] = '';
            this.p_filtros['p_caja'] = '';
        }
        if (evt.source.ngControl.name == 'cMarca') {
            //this.p_filtros['p_clase']   = evt.value;
            this.p_filtros['p_marca'] = evt.value;
            this.p_filtros['p_familia'] = '';
            this.p_filtros['p_modelo'] = '';
            this.p_filtros['p_linea'] = '';
            this.p_filtros['p_caja'] = '';

            
            this.form_linea.get("cFamilia").setValue(''); 
            this.form_linea.get("cModelo").setValue('');
            this.form_linea.get("cCaja").setValue('');
            this.form_linea.get("cLinea").setValue('');
            
        }

        if (evt.source.ngControl.name == 'cModelo') {
            //this.p_filtros['p_clase']   = evt.value;
            //this.p_filtros['p_marca']   = evt.value;
            //this.p_filtros['p_familia'] = evt.value;
            this.p_filtros['p_modelo'] = evt.value;
            this.p_filtros['p_caja'] = '';
            this.p_filtros['p_linea'] = '';
            this.p_filtros['p_familia'] = '';

            
            this.form_linea.get("cFamilia").setValue(''); 
            this.form_linea.get("cCaja").setValue('');
            this.form_linea.get("cLinea").setValue('');
        }

        if (evt.source.ngControl.name == 'cFamilia') {
            //this.p_filtros['p_clase']   = evt.value;
            //this.p_filtros['p_marca']   = evt.value;
            this.p_filtros['p_familia'] = evt.value;
            //this.p_filtros['p_modelo'] = '';
            this.p_filtros['p_linea'] = '';
            this.p_filtros['p_caja'] = '';

            
            this.form_linea.get("cCaja").setValue('');
            this.form_linea.get("cLinea").setValue('');
        }
       
        if (evt.source.ngControl.name == 'cCaja') {
            //this.p_filtros['p_clase']   = evt.value;
            //this.p_filtros['p_marca']   = evt.value;
            //this.p_filtros['p_familia'] = evt.value;
            //this.p_filtros['p_modelo']  = evt.value;                
            this.p_filtros['p_caja'] = evt.value;
            this.p_filtros['p_linea'] = '';
            this.form_linea.get("cLinea").setValue('');
        }
        if (evt.source.ngControl.name == 'cLinea') {
            //this.p_filtros['p_clase']   = evt.value;
            //this.p_filtros['p_marca']   = evt.value;
            //this.p_filtros['p_familia'] = evt.value;
            //this.p_filtros['p_modelo']  = evt.value;                
            //this.p_filtros['p_caja']    = evt.value;    
            this.p_filtros['p_linea'] = evt.value;
        }
        //if(evt.source.)
        this.sendRequest_change();
    }
    sendRequest_init() {
        //ACCESORIOS
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVACCESORIOS',
            this.p_filtros
        )
            .then(result => {
                this.lovAccesorios = result.datos;
            })
            .catch(error => console.log(error));

        //CIUDADES    
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVCIUDADES',
            {
                p_filtro: ''
            }
        )
            .then(result => {
                //console.log(result.datos)
                this.options = result.datos;
            })
            .catch(error => console.log(error));

        //TELEFONOS
        //let c_user = JSON.parse(localStorage.getItem('currentUser'));    
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVTELEFONOCLIENTE',
            {
                p_filtro: ''
            }
        )
            .then(result => {
                //console.log(result.datos)
                this.lovTelefono = result.datos;
                console.log("lovTelefono", this.lovTelefono)
            })
            .catch(error => console.log(error));
        //ASESORES        
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVASESORCLIENTE',
            {
                p_filtro: ''
            }
        )
            .then(result => {
                //console.log(result.datos)
                this.lovAsesor = result.datos;
                console.log("lovAsesores", this.lovAsesor)
            })
            .catch(error => console.log(error));    

    }
    sendRequest_change() {
        //CLASE
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getGeneral&p_tabla=clase',
            this.p_filtros
        )
            .then(result => {
                this.lovClase = result.datos;
            })
            .catch(error => console.log(error));
        //MARCA
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getGeneral&p_tabla=marca',
            this.p_filtros
        )
            .then(result => {
                this.lovMarca = result.datos;
            })
            .catch(error => console.log(error));
        //FAMILIA
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getGeneral&p_tabla=familia',
            this.p_filtros
        )
            .then(result => {
                this.lovFamilia = result.datos;
            })
            .catch(error => console.log(error));
        //MODELO
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getGeneral&p_tabla=modelo',
            this.p_filtros
        )
            .then(result => {
                this.lovModelo = result.datos;
            })
            .catch(error => console.log(error));
        //CAJA
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getGeneral&p_tabla=caja',
            this.p_filtros
        )
            .then(result => {
                this.lovCaja = result.datos;
            })
            .catch(error => console.log(error));
        //LINEA
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getGeneral&p_tabla=linea',
            this.p_filtros
        )
            .then(result => {
                this.lovLinea = result.datos;
            })
            .catch(error => console.log(error));
    }
    
    submit2() {        
        console.log("CONTACT",this.form_contacto.value); 
       // alert('aaa');       return;
        this.loading = true;
        if(!this.form_linea.valid){
            swal(
                AppComponent.tituloalertas,
                'Formulario Clase (1) Con inconsistencias !',
                'info'
            );
            this.loading = false;
            return ;
        }
        if(!this.form_contacto.valid){
                swal(
                    AppComponent.tituloalertas,
                    'Formulario Descripcion (1) Con inconsistencias !',
                    'info'
                );
                this.loading = false;
                return ;
        }
        
        if(this.child.files.length==0){
            swal(
                AppComponent.tituloalertas,
                'Es Necesario Imagen Principal (3) !',
                'info'
            );
            this.loading = false;
            return;
        }
        if(this.child2.files.length==0){
            swal(
                AppComponent.tituloalertas,
                'Es Necesario Imagenes Clasificado (3) !',
                'info'
            );
            this.loading = false;
            return;
        }
        if(!this.form_precio.valid){
            swal(
                AppComponent.tituloalertas,
                'Formulario Precios (5) Con inconsistencias !',
                'info'
            );
            this.loading = false;
            return;
        }
        

        //return;
        this.imagenes_principal = [];
        //let imagenes_otras[]:any;
        this.imagenes_otras = [];

        this.child.files.map(res => {
            this.imagenes_principal.push({
                name: res.file.name,
                src: res.src
            })
        });

        this.child2.files.map(res => {
            this.imagenes_otras.push({
                name: res.file.name,
                src: res.src
            })
        });

        //console.log("AAAA", this.imagenes_principal)

        this.promiseService.createService(
            AppComponent.urlservicio + '?_p_action=_publicar',
            {
                imagenes_principal: this.imagenes_principal,
                imagenes_otras: this.imagenes_otras,
                form_linea: this.form_linea.value,
                form_contacto: this.form_contacto.value,
                form_accesorios: this.form_accesorios.value,
                form_precio: this.form_precio.value,
                p_consecutivo : this.p_consecutivo ,
                p_prueba : 'S'
            }
            //this.data_file_otras
        )
            .then(result => {
                swal(
                    AppComponent.tituloalertas,
                    'Datos Actualizados Correctamente !',
                    'success'
                );
                
                //alert('aaaaaa')
                this.loading = false;
                this.router.navigate(['cuenta', {outlets: { 'cuenta-opcion': ['clasificado','P'] }}]);        
                if(result.datos!=undefined){
                    this.loading = false;
                    //console.log("DATAAAA",result.datos)
                    this.options = result.datos;                   
                    this.p_consecutivo =  this.options.codigo ; 
                }
                this.loading = false;
                //let config = new MatSnackBarConfig();
                //config.extraClasses = ['custom-class'];
                //this.snackBar.open('Datos Actualizados Correctamente', 'ACtualizacion' ? 'Ok' : undefined, config);

            })
            .catch(error => {
                this.loading = false;
                console.log("ERROR",error)
                alert(error._body);
                //console.log(error._body)
                //let config = new MatSnackBarConfig();
                //config.extraClasses = ['custom-class'];
                //this.snackBar.open(error._body, 'Error' ? 'Ok' : undefined, config);
            });

    }

}

