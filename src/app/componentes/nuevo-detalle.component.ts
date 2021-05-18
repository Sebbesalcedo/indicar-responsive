import { Component, OnInit,Pipe ,PipeTransform, AfterViewInit, ViewChild} from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { FichaTecnica } from '../clases/ficha-tecnica.class';
//import { SwiperModule } from 'ngx-useful-swiper';
import { NgxGalleryOrder, NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation,  NgxGalleryLayout, NgxGalleryImageSize} from 'ngx-gallery';
//declare var Swiper: any;


import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {MatDialog} from '@angular/material';


@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
    transform(value: any, args?: any[]): Object[] {
        let keyArr: any[] = Object.keys(value),
            dataArr = [],
            keyName = args[0];

        keyArr.forEach((key: any) => {
            value[key][keyName] = key;
            dataArr.push(value[key])
        });     

        if(args[1]) {
            dataArr.sort((a: Object, b: Object): number => {
                return a[keyName] > b[keyName] ? 1 : -1;
            });
        }

        return dataArr;
    }
}

@Component({
  selector: 'app-nuevo-detalle',
  templateUrl: '../templates/nuevo.detalle.template.html',
  styleUrls: ['../css/vitrina.css']

})


export class NuevoDetalleComponent implements OnInit {


  p_consecutivo:string='';
  sub;
  //FILTROS
  p_filtros={};
  //RESULTADO
  items;
  items_ficha;  
  items_imagenes;
  items_concesinarios;
  items_imagenes_total=0;  
  total_items=0;
  items_ficha_total=0;
  items_concesinarios_total=0;

  fichatecnica = new Map();
  grupoficha:FichaTecnica[]=[];  

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  loading=false;
  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {

window.scroll(0, 0);
     //VALIDAR SI ESTA EN MODO MODIFICAR
    if (this.route.snapshot.paramMap.get('id') != null) {
      this.p_consecutivo=this.route.snapshot.paramMap.get('id');
        this.get_record(this.route.snapshot.paramMap.get('id'))
    }else{  
        alert('Es necesario codigo de linea');
        this.router.navigate(['nuevo']);                       
    //    this.p_consecutivo=null;
    //    this.sendRequest_change();
    }
    /*
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.p_filtros['p_codigo']= params['p_codigo'];
      this.p_filtros['p_anno']= params['p_anno'];
      this.sendRequest();
    });
    */

    //galeria ngx
    this.galleryOptions = [
            {width: '100%',
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
                imageSize:'contain'
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
  get_record(id:string){
    //GET INFORMACION DE LA LINEA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio + '?_p_action=_nuevodetalle', 
      {
        p_codigo:id
      }
    )
    .then(result => {
      this.items=result.datos;
      this.total_items=result.registros      
    })
    .catch(error => {
      alert(error._body)    
    }); 
    //GET INFORMACION DE LA FICHA TECNICA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio + '?_p_action=_nuevodetalle', 
      {
        p_codigo:id,
        p_operacion:'getfichatecnica'
      }
    )
    .then(result => {
      this.items_ficha=result.datos;
      this.items_ficha_total=result.registros 
      this.items_ficha.forEach(element => {
        let arr=[];
        if(this.fichatecnica.get(element.gruptec_nombre)==undefined){
            this.items_ficha.forEach(element2 => {
              if(element2.gruptec_nombre==element.gruptec_nombre){
                  arr.push(element2);
              }
            });
            this.grupoficha.push({
                key:element.gruptec_nombre,
                grupos:arr
            });
            this.fichatecnica.set(element.gruptec_nombre,
                arr
            );
        }
    });
    })
    .catch(error => {
      alert(error._body)    
    }); 
    //GET INFORMACION DE LAS IMAGENES
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio + '?_p_action=_nuevodetalle', 
      {
        p_codigo:id,
        p_operacion:'getimagenes'
      }
    )
    .then(result => {
      this.items_imagenes=result.datos;
      this.items_imagenes_total=result.registros  
      this.items_imagenes.map((todo, i) => {       
        this.galleryImages[i]={
             small: todo.fotoslinea_ruta, 
             medium: todo.fotoslinea_ruta , 
             big:   todo.fotoslinea_ruta 
        };
     });      
    })
    .catch(error => {
      alert(error._body)    
    });
    //GET INFORMACION DE LAS CONCESIONARIOS QUE LO TIENE 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio + '?_p_action=_nuevodetalle', 
      {
        p_codigo:id,
        p_operacion:'getconcesionarios'
      }
    )
    .then(result => {
      this.items_concesinarios=result.datos;
      this.items_concesinarios_total=result.registros           
    })
    .catch(error => {
      alert(error._body)    
    });
  }
  ngOnDestroy() {
    //this.sub.unsubscribe();
  }
  sendRequest(){
    //{"linefich_linea":"6663","linfic_ano":"2018","gruptec_nombre":"CAJA DE CAMBIOS","asptec_nombre":"TIPO","fictec_valor":"AUTOM\u00c1TICO"}
    //RESULTADO 
    
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getItemsNuevoDetalle', 
      Object.assign(
        this.p_filtros
      )
    )
    .then(result => {
      this.items=result.datos;
      this.total_items=result.registros
      
      //console.log(this.items[0].ficha)
      console.log(this.items)
    })
    .catch(error => console.log(error)); 


    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getItemsNuevoDetalle_FichaTecnica', 
        Object.assign(
          this.p_filtros
        )
      )
      .then(result => {
        this.items_ficha=result.datos;
        this.items_ficha_total=result.registros
        //console.log(this.items[0].ficha)
        //PARA ASIGNAR LA FICHA TECNICA 
        console.log("FICHA")
        console.log(this.items_ficha)
        this.items_ficha.forEach(element => {
            let arr=[];
            if(this.fichatecnica.get(element.gruptec_nombre)==undefined){
                this.items_ficha.forEach(element2 => {
                  if(element2.gruptec_nombre==element.gruptec_nombre){
                      arr.push(element2);
                  }
                });
                this.grupoficha.push({
                    key:element.gruptec_nombre,
                    grupos:arr
                });
                this.fichatecnica.set(element.gruptec_nombre,
                    arr
                );
            }
        });
        console.log(this.items)
      })

      .catch(error => console.log(error)); 

      this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_getItemsNuevoDetalle_Imagenes', 
        Object.assign(
          this.p_filtros
        )
      )
      /*.then(result => {
        this.items_imagenes=result.datos;
        this.items_imagenes_total=result.registros
        //console.log(this.items[0].ficha)
        //PARA ASIGNAR LA FICHA TECNICA 
     
      })*/
       .then(result => {
        this.items_imagenes=result.datos;
        this.items_imagenes_total=result.registros
        //console.log(this.items[0].ficha)
        console.log("XCARIMG",this.items_imagenes)
        //PARA ASIGNAR LA FICHA TECNICA 
        this.items_imagenes.map((todo, i) => {
           //this.filtros.clase[i].selected = false;
           this.galleryImages[i]={

                small: todo.fotoslinea_ruta, //'assets/1-small.jpg',
                medium: todo.fotoslinea_ruta , //'assets/1-medium.jpg',
                big:   todo.fotoslinea_ruta // 'assets/1-big.jpg'
            
           };
        });   
        console.log("XCAR12333",this.galleryImages);
     
      })
      .catch(error => console.log(error));

     // {"registros":"3","success":"true","datos":[{"linea_codigo":"6663","fotoslinea_codigo":"2","fotoslinea_nombre":"Exterior 1.jpg","fotoslinea_tag":"LINEA_EXTERIOR","fotoslinea_ruta":"https:\/\/d1wx0q0ct4xanw.cloudfront.net\/LA\/LINEAS\/Xb3E5hV0r7ZHDlKAlK1DMP5iOWAdTW1vnExdbpiusT0\/Xb3E5hV0r7ZHDlKAlK1DMP5iOWAdTW1vnExdbpiusT0jxh1iBD-MPFd2NMAIMSFB4uTEez9PhpbGMjW3GfkYyY.jpg","fotoslinea_color_orden":"1"},{"linea_codigo":"6663","fotoslinea_codigo":"1","fotoslinea_nombre":"Exterior 2.jpg","fotoslinea_tag":"LINEA_EXTERIOR","fotoslinea_ruta":"https:\/\/d1wx0q0ct4xanw.cloudfront.net\/LA\/LINEAS\/Xb3E5hV0r7ZHDlKAlK1DMP5iOWAdTW1vnExdbpiusT0\/Xb3E5hV0r7ZHDlKAlK1DMP5iOWAdTW1vnExdbpiusT08djocJaS4Oqw84brNYpl4O9phBHazs3K-mANuHA-HCI.jpg","fotoslinea_color_orden":"2"},{"linea_codigo":"6663","fotoslinea_codigo":"3","fotoslinea_nombre":"Exterior 3.jpg","fotoslinea_tag":"LINEA_EXTERIOR","fotoslinea_ruta":"https:\/\/d1wx0q0ct4xanw.cloudfront.net\/LA\/LINEAS\/Xb3E5hV0r7ZHDlKAlK1DMP5iOWAdTW1vnExdbpiusT0\/Xb3E5hV0r7ZHDlKAlK1DMP5iOWAdTW1vnExdbpiusT0XuQlxMLqjS_vGRUP1rcXyNlDKh3dwzcsokrQU-C0s2w.jpg","fotoslinea_color_orden":"3"}]}

  }
  reload():void{
      this.router.navigate(['nuevo'], { queryParams: this.p_filtros });
      this.sendRequest();
  }
  
}


