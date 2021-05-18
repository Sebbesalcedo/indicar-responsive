import { Component, OnInit, Input,Pipe,PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';



@Component({
  selector: 'mapa-concesionario-item',
  templateUrl: '../templates/mapa.item.concesionario.template.html'
  //,styleUrls: ['./heroes.component.css']
})
export class MapaItemConcesionarioComponent implements OnInit {


   logoConcesionario: any = {
        pagination: {
        el: '.swiper-pagination',
        },
        spaceBetween: 50,
        centeredSlides: true,
        paginationClickable: true,
        slidesPerView: 5,
        autoplay: {
          delay: 2500
        },

          navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        },

        breakpoints: {
        1024: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        }
      }
    };

    items_concesionarios;
    totalitems_concesionarios=0;

    @Input() item;
    @Input() filtros;
    @Input() totalregsitros;
    @Input() cliente;
    codigo_usuario:string='';
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private promiseService: WebApiPromiseService
    ) { }
    ngOnInit() {
      this. sendRequest();
      
      let c_user = JSON.parse(localStorage.getItem('currentUser'));
      if(c_user!=null){
        this.codigo_usuario=c_user.codigo;
      }
    }    

    sendRequest(){
        //RESULTADO CONCESIONARIOS
      this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio+'?_p_action=_mapaconcesionario',
        {
          p_tabla:'concesionarios'
        }       
      )
      .then(result => {
        this.items_concesionarios=result.datos;
        this.totalitems_concesionarios=result.registros
        //this.setPage(1);
      })
      .catch(error => {
        //console.log(error)
        alert(error._body);
      });
    }
    detail(pcodigo:string):void{    
      this.router.navigate(['clasificados/detalle',pcodigo]);
      console.log(pcodigo);
    }
    change():void{          
      this.router.navigate(['clasificados'], { queryParams: this.filtros }); 
    }
    trackByFn(index, item) {
      return index; // or item.id
    }
    setFavorito(pcodigo: string, index: number): void {    
      if(this.item[index].isfavorito=='S'){        
        this.promiseService.deleteService(
          AppComponent.urlservicio + '?_p_action=_clientefavorito',
          {
            venta_codigo: pcodigo
          }
          //this.data_file_otras
        )
          .then(result => {
              //console.log(result.datos)            
              this.item[index].isfavorito = 'N';
          })
          .catch(error => {
              this.item[index].isfavorito = 'S';
              alert(error._body)            
          });
        
      }else{
        this.promiseService.createService(
          AppComponent.urlservicio + '?_p_action=_clientefavorito',
          {
            venta_codigo: pcodigo
          }
          //this.data_file_otras
        )
          .then(result => {
              //console.log(result.datos)            
              this.item[index].isfavorito = 'S';
          })
          .catch(error => {
              this.item[index].isfavorito = 'N';
              alert(error._body)            
          });        
      }  
      //this.router.navigate(['nuevo/detalle',pcodigo+panno]);     
    }
} 

