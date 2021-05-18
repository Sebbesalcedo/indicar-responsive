import { Component, OnInit } from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { EncryptService }   from '../servicios/encrypt.service';

import { SwiperModule } from 'ngx-useful-swiper';

@Component({
  selector: 'app-inicio',
  templateUrl: '../templates/inicio.template.html',
  styleUrls: ['../css/inicio.css']
})

export class InicioComponent implements OnInit {
  lovFinancieras:any;
  logoFinanaciera: any = {
        pagination: {
        el: '.swiper-pagination',
        },
        paginationClickable: true,
        spaceBetween: 50,
         slidesPerView: 5,

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


  // FILTROS
  p_filtros = {};
   // RESULTADO
   items_gangas;
   totalitems_gangas=5;
  //  items_novedades;
  //  totalitems_novedades=5;
   items_unicoduenno;
   totalitems_unicoduenno=5;
   items_concesionarios;
   totalitems_concesionarios=0;

   codigo_usuario:string='';


  constructor(private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router, private _http: HttpClient,
    private Encrypt: EncryptService
  ) { }

  ngOnInit() {
    this. sendRequest();
    window.scrollTo(0, 0)


    let c_user = JSON.parse(localStorage.getItem('currentUser'));
    if(c_user!=null){
      this.codigo_usuario=c_user.codigo;
    }
  }

  private _randomImageUrls(images: Array<{id: number}>): Array<string> {
    return [1, 2, 3].map(() => {
      const randomId = images[Math.floor(Math.random() * images.length)].id;
      return `https://picsum.photos/900/500?image=${randomId}`;
    });
  }

  sendRequest(){
    //RESULTADO GANGAS
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_inicio',
      {
        p_tabla:'gangas'
      }       
    )
    .then(result => {
      this.items_gangas=result.datos;
      result.datos.forEach(clasificado => {
        clasificado.venta_codigo = this.Encrypt.encrypt(clasificado.venta_codigo);
      });
      this.totalitems_gangas=result.registros
      //this.setPage(1);
    })
    .catch(error => {
      alert(error._body);
    }); 

    //RESULTADO NOVEDADES
    // this.promiseService.getServiceWithComplexObjectAsQueryString(
    //   AppComponent.urlservicio+'?_p_action=_inicio',
    //   {
    //     p_tabla:'novedades'
    //   }       
    // )
    // .then(result => {
    //   this.items_novedades=result.datos;
    //   this.totalitems_novedades=result.registros
    //   //this.setPage(1);
    // })
    // .catch(error => {
    //   //console.log(error)
    //   alert(error._body);
    // }); 

    //RESULTADO UNICO DUEÑO
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_inicio',
      {
        p_tabla:'unicoduenno'
      }       
    )
    .then(result => {
      this.items_unicoduenno=result.datos;
      result.datos.forEach(clasificado => {
        clasificado.venta_codigo = this.Encrypt.encrypt(clasificado.venta_codigo);
      });
      this.totalitems_unicoduenno=result.registros
      //this.setPage(1);
    })
    .catch(error => {
      //console.log(error)
      alert(error._body);
    }); 

    //RESULTADO CONCESIONARIOS
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_inicio',
      {
        p_tabla:'concesionarios'
      }       
    )
    .then(result => {
      //console.log("items_concesionarios",result.datos);
      this.items_concesionarios=result.datos;
      this.totalitems_concesionarios=result.registros
      //this.setPage(1);
    })
    .catch(error => {
      //console.log(error)
      alert(error._body);
    });

     //FINANCIERAS    
     this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio + '?_p_action=_getLovs',
      {
          p_lov: '_LOVFINANCIERAS'
      }
  )
      .then(result => {
          this.lovFinancieras = result.datos;
         // console.log("FIN",this.lovFinancieras);
      })
      .catch(error => console.log(error));    

  }

  detail(pcodigo:string):void{
    this.router.navigate(['clasificados/detalle'], { queryParams: {
      p_codigo:pcodigo
    } });
}

detail_nuevo(pcodigo:string,panno:string):void{
  this.router.navigate(['nuevo/detalle'], { queryParams: {
    p_codigo:pcodigo,
    p_anno:panno
  } });
}

}

