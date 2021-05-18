  import { Component, OnInit, ChangeDetectorRef, OnDestroy,Inject } from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { AppComponent } from '../app.component';
import {MediaMatcher} from '@angular/cdk/layout';
import { currentUser } from '../interface/currentuser.interface';
import {EncabezadoComponent } from '../componentes/encabezado.component';
//import { VirtualTimeScheduler,Observable } from 'rxjs';
import { timer } from 'rxjs/observable/timer';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-cuenta',
  templateUrl: '../templates/cuenta.template.html',
  styleUrls: ['../css/cuenta.css']
})
export class CuentaComponent implements OnInit , OnDestroy {
   mobileQuery: MediaQueryList;
  sub;
  //FILTROS
  p_filtros={};
  varopened:boolean;
  //RESULTADO

  items; 
  total_items=100;
  error = '';

  clasificadoRevision=0;
  clasificadoAprobados=0;
  clasificadoRechazados=0;
  clasificadoInactivos=0;
  clasificadoVendidos=0;
  currentuser:currentUser;
  subscribetimer:any;
  isloading:boolean=false;
  
  private _mobileQueryListener: () => void;

  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    @Inject(EncabezadoComponent) private parent: EncabezadoComponent,
  ) { 
    this.mobileQuery = media.matchMedia('(max-width:768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this.mobileQuery = media.matchMedia('(max-width:768px)');
   
  }
  setLoading(value:boolean){
    this.isloading=value;
    this.changeDetectorRef.detectChanges()
  }
  ngOnInit() {
    // sidebar abierto o cerrado.
    var bod = document.getElementsByTagName('body')[0].getBoundingClientRect();
    if(bod.width > 768){
      this.varopened = true;
    }else{
      this.varopened = false;
    }
    this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.p_filtros['p_token']= localStorage.getItem("currentUser");
     // this.sendRequest();
     this.parent.getInfo();
      window.scrollTo(0, 0);
    });
   
    
/*
    const source = timer(1000, 60000);
    this.subscribetimer = source.subscribe(val => {
      console.log("11111",val);
      this.sendRequest();
    });*/
    
  }
  public getinfo(){
    this.parent.getInfo();
  }
  ngOnDestroy() {
    //alert('onDestroy');
    //this.subscribetimer.unsubscribe();
    this.sub.unsubscribe();
     this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  sendRequest(){
    
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getCuentaInicio', 
      Object.assign(
        this.p_filtros,
        {
          currentPage : 1,
          sizepage    : AppComponent.paginasize
        }
      )
    )
    .then(result => {
      this.items=result.datos;
      this.total_items=result.registros;
      this.clasificadoRevision=result.datos[0].cant_clasificadosrevision;
      this.clasificadoAprobados=result.datos[0].cant_clasificadosaprobados;
      this.clasificadoRechazados=result.datos[0].cant_clasificadosrechazados;
      this.clasificadoInactivos=result.datos[0].cant_clasificadosfinalizados;
      this.clasificadoVendidos=result.datos[0].cant_clasificadosvendidos;
  
      console.log("Items",this.items);
      //this.setPage(1);
    })
    .catch(error => {
        this.error=error._body;
       // console.log("ERRRORRR",error._body)
    }); 
  }
  
  openMenu(opcion){
    if(opcion==1){
        this.router.navigate(['comentarios'], { queryParams: {
            p_codigo:this.p_filtros['p_token'] 
          } });
    }
   
  }
  reload(pcodigo:string):void{  
    if(pcodigo=='1'){
      this.router.navigateByUrl('/clasificado', { skipLocationChange: true });
     
     /* setTimeout(()=>self.router.navigate(['emails',{outlets: {aux: null}}]));

      this.router.navigate(['clasificado'], { queryParams: {
        p_estado:'A'
      } });    */
    }
    if(pcodigo=='2'){
      this.router.navigate(['clasificado']);  
         
    }
}

  


 
}
