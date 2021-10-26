import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-recomendador',
  templateUrl: './recomendador.component.html',
  styleUrls: ['./recomendador.component.css']
})
export class RecomendadorComponent implements OnInit{ //,AfterViewInit {
  loading:boolean = false;
  // variables
  ls          = null;
  minPrice    = null;
  maxPrice    = null;
  minYear     = null;
  maxYear     = null;
  beneficiosSelected = null;
  terms       = [];
  vehiculos   = [];

  constructor(
    private WebApiService:WebApiService
  ){}

  ngOnInit() {
    this.ls = JSON.parse(localStorage.getItem('dataRecomendador'));
    if(this.ls != null){
      this.sendrequest();
    }else{
      console.log('debe configurar los parametros para que indicar le recomiende algun vehiculo');
    }
    this.setEventScroll();
  }



  sendrequest(){
    this.loading = true;
    let body;
    body = {
      minPrice:   this.ls.minPrice,
      maxPrice:   this.ls.maxPrice,
      minYear:    this.ls.minYear,
      maxYear:    this.ls.maxYear,
      beneficios: this.ls.beneficios
    }
    this.WebApiService.postRequest(AppComponent.urlService,body,{
      _p_action: '_recomendador',
      action: 'getRecomendacion'
    })
    .subscribe(
      data=>{
        if(data.success){
          let campos;
          let valores;
          
          // console.log(data);
          this.terms = data.campos;
          this.vehiculos = data.datos;
          let ratingMax= [];

          this.vehiculos.forEach(vehiculo=>{
            // ---------------------- IMAGEN DE LA LINEA -----------------------------
            if(vehiculo.foto == null || vehiculo.foto == ""){
              vehiculo.foto = "../../../assets/images/imagen-defecto-indicar.jpg";
            }
            //  ----------------------- NOMBRE TRUNCADO ---------------------------
            vehiculo.linea = vehiculo.linea_nombre.substr(0,45)+"...";
            // ------------------------ INFORMACION DEL VEHICULO RATING  ------------------------
            let info = JSON.parse(vehiculo.vehicle_information);
            console.log(info);
            let rating = [];
            
            info.forEach(i=>{
              //registro rating 
              rating.push({
                beneficio: i.catbeneficio_descripcion,
                valor: i.valor
              });
            });
            // obtengo el maximo rating
            if(ratingMax.length > 0){
              ratingMax.forEach(element => {
                rating.forEach(rat=>{
                  if(element.beneficio == rat.beneficio && element.valor < rat.valor){
                    element.valor = rat.valor;
                  }
                });
              });
            }else{
              rating.forEach(rat=>{
                ratingMax.push({
                  beneficio: rat.beneficio,
                  valor: rat.valor
                });
              })
            }
            
            vehiculo.rating = rating;
            //  ---------------------------- VALORES DE CAMPOS DE LA LINEA ---------------------------
            valores = [];
            campos = vehiculo.campos;
            campos.forEach(beneficio=>{
              valores.push({
                beneficio: true,
                descripcion: ""
              });
              let campo;
              campo = JSON.parse(beneficio.campos);
              campo.forEach(c=>{
                valores.push({
                  beneficio: false,
                  descripcion: c.fitelinea_valorcampo
                })
              })
            });
            // console.log(valores);
            vehiculo.valores = valores;
          });
          //  ------------------------------- CALCULO PORCENTAJES DE RATING MAXIMOS ----------------------------------
          // PREGUNTAR SI LOS HAGO EN BASE AL MAXIMO RATING POSIBLE O UN PROMEDIO DE LAS RECOMENDACIONES.
          let orderBeneficio = [];

          this.vehiculos.forEach((vehiculo,index)=>{
            // rating maximo
            let aux = 1;
            ratingMax.forEach(rat=>{

              vehiculo.rating.forEach(element => {
                if(rat.beneficio == element.beneficio){
                  if(aux === 1){
                    orderBeneficio[index]=Array();
                    orderBeneficio[index].push({
                      beneficio: rat.beneficio,
                      valor: element.valor,
                      porcentaje: (element.valor*100) / (rat.valor + 200)
                      // rat.porcentaje = (rat.valor * 100) / valorMaximo;
                    });
                    aux++;
                  }else{
                    orderBeneficio[index].push({
                      beneficio: rat.beneficio,
                      valor: element.valor,
                      porcentaje: (element.valor*100) / (rat.valor + 200).toFixed(2)
                    });
                  }
                }
              });

              // if(aux === 1){
              //   console.log(1);
              //   orderBeneficio[index]=Array();
              //   orderBeneficio[index].push(1);
              //   aux++;
              // }else{
              //   console.log(2);
              //   orderBeneficio[index].push(2);
              // }
              
            });
            this.vehiculos[index].rating = orderBeneficio[index];
          });


          let prom = new Promise((resolve,reject)=>{
            let header;
            let comparatorTerm;
            let headerSizeY;
            let sec;
            header          = document.querySelector('.comparator-header');
            comparatorTerm  = document.querySelector('.comparator-term');
            sec = document.querySelector('.global-content');
            headerSizeY     = header.offsetHeight;
            
            let interval = setInterval(function(loading){
              let height = comparatorTerm.style.paddingTop;
              height = height.substring(0,height.length-2);
              if(height == headerSizeY && height > 235){
                clearInterval(interval);
                resolve(true);
                // console.log(loading);
                // loading();
              }else{
                headerSizeY     = header.offsetHeight;
                comparatorTerm.style.paddingTop = headerSizeY+"px";
              }
            },300);
          });

          prom
          .then(success=>{
            this.loading = false;
          })
          .catch(error=>{
            this.loading = false;
            console.log('falso');
          })
        }
        // console.log(this.vehiculos );
        
        // this.loading = false;
        // console.log(this.terms);
      },
      error=>{
        this.loading = false;
        console.log(error);
      }
    );
  }

  setEventScroll(){
    let header;
    let top;
    let maxTop;
    let dim;
    let comparator 
    let comparatorBody;
    let comparatorTerm;
    let headerSizeY;
    let termSizeX;
    header          = document.querySelector('.comparator-header');
    comparator      = document.querySelector('.container-comparator');
    comparatorBody  = document.querySelector('.comparator-body');
    comparatorTerm  = document.querySelector('.comparator-term');
    headerSizeY     = header.offsetHeight;
    termSizeX       = comparatorTerm.offsetWidth + comparatorTerm.offsetLeft;
    comparatorTerm.style.paddingTop = headerSizeY+"px";
    window.addEventListener('scroll',function(){ 
      headerSizeY     = header.offsetHeight;
      termSizeX       = comparatorTerm.offsetWidth + comparatorTerm.offsetLeft;
      dim = comparator.getBoundingClientRect();
      maxTop = dim.height - 240;
      // top =this.scrollY - 40;
      top = this.scrollY - 100;
      if(top >= 0 && top <= maxTop){
        // header.style.opacity = 0;
        // HEADER TOP
        header.style.position = 'fixed';
        if(window.innerWidth < 768){
          header.style.top = '50px';
        }else{
          header.style.top = '80px';
        }
        // COMPARADOR TOP
        comparatorBody.style.marginTop = headerSizeY+"px";
        // COMPARADOR LEFT
        header.style.left = (termSizeX - comparator.scrollLeft)+"px";
      }else{
        let left = header.style.left;
        left = left.substring(0,left.length-2);
        header.style.position = 'relative';
        header.style.top = "0px";
        header.style.left = "0px";
        comparatorBody.style.marginTop = "0px";
      }
    });

    comparator.addEventListener('scroll',function(){
      if(comparator.scrollLeft>=0){
        if(window.scrollY>0){
          header.style.left = (termSizeX - comparator.scrollLeft)+"px";
        }else{
          header.style.right = "-"+comparator.scrollLeft+"px";
          header.style.left = "0px";
        }
      }
    });
    
  }

}
