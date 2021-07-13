import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';
import { EncryptService } from 'src/app/servicios/encrypt.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clasificados',
  templateUrl: './clasificados.component.html',
  styleUrls: ['./clasificados.component.css']
})
export class ClasificadosComponent implements OnInit {
  loading:boolean   = false;
  terms:any         = [];
  termsValues:any   = [];
  vehiculos:any     = [];

  constructor(
    private WebApiService:WebApiService,
    private encrypt:EncryptService,
    private snackBar:MatSnackBar,
    private router:Router
  ){}

  ngOnInit() {
    this.sendRequest();
    this.setEventScroll();
  }

  sendRequest(){
    this.loading = true;
    let compare = "";
    let setCompare = JSON.parse(localStorage.getItem('setCompare'));
    if(setCompare != null){
      setCompare = setCompare.map(element => element = this.encrypt.desencrypt(element));
      compare = setCompare.join(',');
      this.WebApiService.getRequest(AppComponent.urlService,{
        _p_action: 'getCompare',
        compare
      })
      .subscribe(
        data=>{
          if(data.success){
            let datos;
            datos = data.datos;

            // GRUPOS
            let grupoAux = "";
            let grupo = false;
            // console.log(datos);
            let campos = JSON.parse(datos[0].campos);
            campos.forEach(campo => {
              if(grupoAux != campo.grupo){
                grupoAux = campo.grupo;
                grupo = true;
              }else{
                grupo = false;
              }
              if(grupo){
                //grupo
                this.terms.push({
                  descripcion: campo.grupo,
                  section: grupo
                })
                // termino
                grupo = false;
                this.terms.push({
                  descripcion: campo.descripcion,
                  section: grupo
                })
              }else{
                this.terms.push({
                  descripcion: campo.descripcion,
                  section: grupo
                })
              }
            });
            
            // VALOR CAMPOS por vehiculos.

            datos.forEach(vehiculo => {
              this.termsValues = [];
              grupoAux = "";
              grupo = false;
              campos = JSON.parse(vehiculo.campos);
              campos.forEach(campo => {
                // valores campos
                if(grupoAux != campo.grupo){
                  grupoAux = campo.grupo;
                  grupo = true;
                }else{
                  grupo = false;
                }
                
                if(grupo){
                  //grupo
                  this.termsValues.push({
                    descripcion: '',
                    section: grupo
                  })
                  // termino
                  grupo = false;
                  this.termsValues.push({
                    descripcion: campo.valor,
                    section: grupo
                  })
                }else{
                  this.termsValues.push({
                    descripcion: campo.valor,
                    section: grupo
                  })
                }
              });
              this.vehiculos.push({
                codigo:   vehiculo.venta_codigo,
                linea_nombre: vehiculo.linea_nombre,
                linea:    vehiculo.linea_nombre.substr(0,45)+"...",
                imagen:   vehiculo.imagen,
                modelo:   vehiculo.venta_modelo,
                marca:    vehiculo.marca_nombre,
                valores: this.termsValues
              });




            });


           
            //console.log(this.vehiculos);
            

            // this.vehiculo;
            // this.termsValues;

            // this.viewComparator = true;
            //console.log(data);
            this.loading=false;



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

          }else{
            this.loading=false;
          }



        },
        error=>{
          this.loading=false;
          console.log(error);
        }
      );
    }

    
  }


  setEventScroll(){
    let header;
    let topHeaderOriginal;
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


  deleteItem(index){
    this.vehiculos = this.vehiculos.filter(vehiculo=>{
      return vehiculo.codigo != index;
    });
    let setCompare = JSON.parse(localStorage.getItem('setCompare'));
    setCompare = setCompare.filter(item=>{
      return this.encrypt.encrypt(index) != item;
    });
    if(setCompare.length <=1){
      this.snackBar.open('No existen vehiculos para comparar', null,{
        duration: 4000
      });
      this.router.navigate(['/clasificados']);
    }
    // console.log(setCompare);
    localStorage.setItem('setCompare',JSON.stringify(setCompare));
  }

}
