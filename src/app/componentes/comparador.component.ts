import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DataSource } from '@angular/cdk/table';
import {AddDialogComponent} from '../dialog/add-telefono.dialog';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


import {AgregarVehiculoDialogComponent} from '../dialog/agregarVehiculo.dialog';

import {  HostListener, Inject  } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatPaginator, MatTableDataSource, MatSort, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions,MatDialog } from '@angular/material';

import { DOCUMENT } from "@angular/platform-browser";
import { NumberValueAccessor } from '@angular/forms/src/directives';
import { FichaTecnica } from '../clases/ficha-tecnica.class';
import { EncryptService } from '../servicios/encrypt.service';

export class dataVehiculo {
  linea_codigo:string;
  linea_nombre:string;
  linea_traccion:string;
  linea_caja:string;
  linea_tipomotor:string;
  linea_capacidadmotor:string;
  linea_foto:string;
  linea_valor:string;
  linea_fichatecnica:string;

  tipocombustible:string='';
  potenciamaxima:string='';
  numcilindros:string='';
  torque:string='';
  cilindrada:string='';
  traccion:string='';
  cajavelocidades:string='';
  cajatipo:string='';
  direcciontipo:string='';
  suspenciontra:string='';
  suspenciondel:string='';
  dimdistanciaejes:string='';
  dimalto:string='';
  dimancho:string='';
  dimlargo:string='';
  cappasajeros:string='';
  capvacio:string='';
  capcarga:string='';
  capfila:string='';
  segairbagscapfila:string='';
  segabs:string='';
  equiespejoselec:string='';
  equibloqueo:string='';
  equiaire:string='';


  constructor(){
      this.linea_codigo='';
  }
  public setDataLinea(
    linea_codigo:string,
    linea_nombre:string,
    linea_traccion:string,
    linea_caja:string,
    linea_tipomotor:string,
    linea_capacidadmotor:string,
    linea_foto:string,
    linea_valor:string
  ){
    this.linea_codigo=linea_codigo;
    this.linea_nombre=linea_nombre;
    this.linea_traccion=linea_traccion;
    this.linea_caja=linea_caja;
    this.linea_tipomotor=linea_tipomotor;
    this.linea_capacidadmotor=linea_capacidadmotor;
    this.linea_foto=linea_foto;
    this.linea_valor=linea_valor;
  }
  public setFichaCampo(campo_string,valor:string){
    if(campo_string=="TIPOCOMBUSTIBLE") this.tipocombustible=valor; 
    if(campo_string=="POTENCIAMAXIMA") this.potenciamaxima=valor; 
    if(campo_string=="NUMEROCILINDROSTIPOCOMBUSTIBLE") this.numcilindros=valor; 
    if(campo_string=="TORQUE") this.torque=valor; 
    if(campo_string=="CILINDRADA") this.cilindrada=valor; 
    if(campo_string=="TRACCION") this.traccion=valor; 
    if(campo_string=="CAJAVELOCIDADES") this.cajavelocidades=valor; 
    if(campo_string=="CAJATIPO") this.cajatipo=valor; 
    if(campo_string=="DIRECCIONTIPO") this.direcciontipo=valor; 
    if(campo_string=="SUSPECIONTRA") this.suspenciontra=valor; 
    if(campo_string=="SUSPECIONDEL") this.suspenciondel=valor; 
    if(campo_string=="DIMDISTANCIAEJES") this.dimdistanciaejes=valor; 
    if(campo_string=="DIMALTO") this.dimalto=valor; 
    if(campo_string=="DIMANCHO") this.dimancho=valor; 
    if(campo_string=="DIMLARGO") this.dimlargo=valor; 
    if(campo_string=="CAPPASAJEROS") this.cappasajeros=valor; 
    if(campo_string=="CAPVACIO") this.capvacio=valor; 
    if(campo_string=="CAPCARGA") this.capcarga=valor; 
    if(campo_string=="CAPFILA") this.capfila=valor; 
    if(campo_string=="SEGAIRBAGS") this.segairbagscapfila=valor; 
    if(campo_string=="SEGABS") this.segabs=valor; 
    if(campo_string=="EQUIESPEJOSELEC") this.equiespejoselec=valor; 
    if(campo_string=="EQUIBLOQUEO") this.equibloqueo=valor; 
    if(campo_string=="EQUIAIRE") this.equiaire=valor; 

    //this.linea_fichatecnica=ficha;

  }
}

@Component({
  templateUrl: '../templates/comparador.template.html',
  styleUrls: ['../css/comparador.css'],
  selector: 'comparador.solicitud.template',
  
  /*providers: [
   {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
 ],*/
})

export class ComparadorComponent implements OnInit {
  remover:boolean[] = [];
  activeIds: string[] =[];
  panels = [0,1,2,4,5];
  listVehiculo:dataVehiculo[]=[];
  step = 0;

  vehiculoAgregado:boolean=true;
  vehiculoInfo:boolean=true;

  vehiculoInfo_list:boolean[]=[false,false,false,false];



  public num;
  tituloCarro:any='';
  lovLinea:any;
  setStep(index: number) {
    this.step = index;
    document.body.scrollTop = document.documentElement.scrollTop = 169;

  }

  public fixed: boolean = false;
  fichatecnica = new Map();
  grupoficha:FichaTecnica[]=[];  
  constructor( 
    @Inject (DOCUMENT) private document: Document,
    public dialog: MatDialog,
    private promiseService: WebApiPromiseService,
    private Encrypt: EncryptService
    ) {

  }

  ngOnInit() {
    this.openAll();
    this.vehiculoAgregado = true;
    this.vehiculoInfo = true;

    this.vehiculoInfo_list=[false,false,false,false];

    window.scrollTo(0, 0)
    this.listVehiculo.push(new dataVehiculo());
    this.listVehiculo.push(new dataVehiculo());
    this.listVehiculo.push(new dataVehiculo());
    this.listVehiculo.push(new dataVehiculo());

    let c_compare =null;   
    console.log("c_compare 1",localStorage.getItem('listVehiculosComparar'));
    // let arr = [];
    // localStorage.setItem('listVehiculosComparar',JSON.stringify(arr));  
    // console.log("c_compare 1",localStorage.getItem('listVehiculosComparar'));
    if(localStorage.getItem('listVehiculosComparar')!=undefined)
       c_compare = JSON.parse(localStorage.getItem('listVehiculosComparar'));     
       console.log(c_compare);
    if(c_compare!=null){
      // var veh:string[]=[];
      let index=0;
      c_compare.forEach(element => {
        console.log(element);
        // console.log(this.Encrypt.desencrypt(element));

        this.getLinea(this.Encrypt.desencrypt(element),index);  
        this.remover[index] = true;
        index++;     
      });       
    }


  }

  getLinea(p_codigo,index:number){
    console.log(p_codigo);
    console.log(JSON.parse(localStorage.getItem('listVehiculosComparar')));
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getFiltroUsado&p_filtro=GETLINEA', 
      {
        p_ventacodigo: p_codigo 
      }
    )
    .then(result => {
      console.log('getLinea',result);
     // console.log("XCAR111",result);
      this.listVehiculo[index].setDataLinea(
        result.datos[0].codigo,
        result.datos[0].descripcion,
        result.datos[0].traccion_nombre,
        result.datos[0].cajacambios_nombre,
        result.datos[0].tipomotor_nombre,
        result.datos[0].capacidadmotor_nombre,
        result.datos[0].foto_url,
        result.datos[0].venta_valor
      );

        //GET INFORMACION DE LA FICHA TECNICA
      this.promiseService.getServiceWithComplexObjectAsQueryString(
        AppComponent.urlservicio + '?_p_action=_nuevodetalle', 
        {
          p_codigo:  result.datos[0].codigo + result.datos[0].codigoventa_modelo,
          p_operacion:'getfichatecnicadetalle'
        }
      )
      .then(result => {
    

      result.datos.forEach(element => {
        if(element.asptec_codigo=='8')this.listVehiculo[index].setFichaCampo("TIPOCOMBUSTIBLE",element.fictec_valor);
        if(element.asptec_codigo=='9')this.listVehiculo[index].setFichaCampo("POTENCIAMAXIMA",element.fictec_valor);
        if(element.asptec_codigo=='7')this.listVehiculo[index].setFichaCampo("NUMEROCILINDROSTIPOCOMBUSTIBLE",element.fictec_valor);
        if(element.asptec_codigo=='11')this.listVehiculo[index].setFichaCampo("TORQUE",element.fictec_valor);
        if(element.asptec_codigo=='6')this.listVehiculo[index].setFichaCampo("CILINDRADA",element.fictec_valor);
        if(element.asptec_codigo=='119')this.listVehiculo[index].setFichaCampo("TRACCION",element.fictec_valor);
        if(element.asptec_codigo=='16')this.listVehiculo[index].setFichaCampo("CAJAVELOCIDADES",element.fictec_valor);
        if(element.asptec_codigo=='15')this.listVehiculo[index].setFichaCampo("CAJATIPO",element.fictec_valor);
        if(element.asptec_codigo=='118')this.listVehiculo[index].setFichaCampo("DIRECCIONTIPO",element.fictec_valor);

        if(element.asptec_codigo=='121')this.listVehiculo[index].setFichaCampo("SUSPECIONTRA",element.fictec_valor);
        if(element.asptec_codigo=='120')this.listVehiculo[index].setFichaCampo("SUSPECIONDEL",element.fictec_valor);

        if(element.asptec_codigo=='26')this.listVehiculo[index].setFichaCampo("DIMDISTANCIAEJES",element.fictec_valor);
        if(element.asptec_codigo=='24')this.listVehiculo[index].setFichaCampo("DIMALTO",element.fictec_valor);
        if(element.asptec_codigo=='25')this.listVehiculo[index].setFichaCampo("DIMANCHO",element.fictec_valor);
        if(element.asptec_codigo=='23')this.listVehiculo[index].setFichaCampo("DIMLARGO",element.fictec_valor);
	
	      if(element.asptec_codigo=='113')this.listVehiculo[index].setFichaCampo("CAPPASAJEROS",element.fictec_valor);
        if(element.asptec_codigo=='110')this.listVehiculo[index].setFichaCampo("CAPVACIO",element.fictec_valor);
        if(element.asptec_codigo=='111')this.listVehiculo[index].setFichaCampo("CAPCARGA",element.fictec_valor);
        if(element.asptec_codigo=='115')this.listVehiculo[index].setFichaCampo("CAPFILA",element.fictec_valor);

	      if(element.asptec_codigo=='33')this.listVehiculo[index].setFichaCampo("SEGAIRBAGS",element.fictec_valor);
        if(element.asptec_codigo=='32')this.listVehiculo[index].setFichaCampo("SEGABS",element.fictec_valor);

        if(element.asptec_codigo=='39')this.listVehiculo[index].setFichaCampo("EQUIESPEJOSELEC",element.fictec_valor);
        if(element.asptec_codigo=='125')this.listVehiculo[index].setFichaCampo("EQUIBLOQUEO",element.fictec_valor);
        if(element.asptec_codigo=='37')this.listVehiculo[index].setFichaCampo("EQUIAIRE",element.fictec_valor);
        
      });  
      console.log("FICC",result.datos);
      //this.listVehiculo[columna-1].setFicha(result.datos);
    })
    .catch(error => {
      alert(error._body)    
    });

      //this.lovLinea =result.datos;
    })
    .catch(error => {          
      alert(error._body)
    });
  }

  openAll()
  {

    /*for(var i=0;i<40;i++){
      this.activeIds = this.panels[i].map(p => "ngb-panel-"+ p);
    }*/
    
    //this.activeIds = this.panels.map(p => "motor_"+p);

    this.activeIds=["motor_01", "traccion_01", "caja_01", "direccion_01", "suspension_01", "dimension_01",
    "peso_01", "seguridad_01", "equipamiento_01" ];

    console.log(this.activeIds);
  }

  clickCategoria(event){

    if(event.nextState){
      /*for(var i=0;i<5;i++){
        this.activeIds[i]= event.panelId.substring(0,event.panelId.length-1)+String(i+1);
      }*/
      this.activeIds= event.panelId.substring(0,event.panelId.length);
      console.log()
    }else{
      this.activeIds = [];

      
    }

    console.log("EVENTTTT",event.panelId);
    //this.openById[event.panelId] = event.nextState;
  }

  @HostListener("window:scroll", []) onWindowScroll() {
    let numbr = this.document.body.scrollTop;
    this.num =  this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if ( this.num > 325 ) {
        this.fixed = true;
    }else if (this.fixed && this.num < 325) {
        this.fixed = false;
    }

    this.tituloCarro={
      'top': String(this.num-330)+'px'
    };


    //console.log('num='+this.num, 'fixed='+this.fixed);

  }
  /*addStyle() {
    let pruebaValor = document.getElementById(this.prueba).style.top = this.num;

    console.log('prueba='+pruebaValor);

  }*/

  agregarVehiculo(columna:number): void {
    this.remover[columna-1] = true;

    var encrypt = this.Encrypt.encrypt;
    var veh;
        const dialogRef = this.dialog.open(AgregarVehiculoDialogComponent, {
          
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result!=undefined){
            if(result.data!=''){
              console.log('lacal antes de agregar',localStorage.getItem('listVehiculosComparar'));
              if(localStorage.getItem('listVehiculosComparar') != undefined){
                veh = JSON.parse(localStorage.getItem('listVehiculosComparar'));
                veh.push(encrypt(result.lineData.venta_codigo));
                console.log(result);
                console.log(veh);
                localStorage.setItem('listVehiculosComparar',JSON.stringify(veh));
              }
              this.loadDataVehiculo(columna,result);
            }

          }
        });
      // console.log(localStorage.getItem('listVehiculosComparar'));
      // if(codigo_vehiculo!= undefined){
      //   console.log('entra');
      //   veh.push(this.Encrypt.encrypt(codigo_vehiculo));
      //   localStorage.setItem('listVehiculosComparar',JSON.stringify(veh));
      // }
  }
  removerVehiculo(columna:number):void{
    this.listVehiculo[columna-1].linea_codigo = '';
    // console.log(localStorage.getItem('listVehiculosComparar'));
    let veh = JSON.parse(localStorage.getItem('listVehiculosComparar'));
    let i = columna-1;
    veh.splice(i,1);
    localStorage.setItem('listVehiculosComparar',JSON.stringify(veh));
    // console.log(localStorage.setItem('listVehiculosComparar',));
    this.vehiculoInfo_list[columna-1] = null;
    // this.listVehiculo[columna-1].setDataLinea(
    //   null,null,null,null,null,null,null,null
    // );
    
    this.remover[columna-1] = false;

      this.listVehiculo[columna-1].setFichaCampo("TIPOCOMBUSTIBLE",null);
      this.listVehiculo[columna-1].setFichaCampo("POTENCIAMAXIMA",null);
      this.listVehiculo[columna-1].setFichaCampo("NUMEROCILINDROSTIPOCOMBUSTIBLE",null);
      this.listVehiculo[columna-1].setFichaCampo("TORQUE",null);
      this.listVehiculo[columna-1].setFichaCampo("CILINDRADA",null);
      this.listVehiculo[columna-1].setFichaCampo("TRACCION",null);
      this.listVehiculo[columna-1].setFichaCampo("CAJAVELOCIDADES",null);
      this.listVehiculo[columna-1].setFichaCampo("CAJATIPO",null);
      this.listVehiculo[columna-1].setFichaCampo("DIRECCIONTIPO",null);

      this.listVehiculo[columna-1].setFichaCampo("SUSPECIONTRA",null);
      this.listVehiculo[columna-1].setFichaCampo("SUSPECIONDEL",null);

      this.listVehiculo[columna-1].setFichaCampo("DIMDISTANCIAEJES",null);
      this.listVehiculo[columna-1].setFichaCampo("DIMALTO",null);
      this.listVehiculo[columna-1].setFichaCampo("DIMANCHO",null);
      this.listVehiculo[columna-1].setFichaCampo("DIMLARGO",null);

      this.listVehiculo[columna-1].setFichaCampo("CAPPASAJEROS",null);
      this.listVehiculo[columna-1].setFichaCampo("CAPVACIO",null);
      this.listVehiculo[columna-1].setFichaCampo("CAPCARGA",null);
      this.listVehiculo[columna-1].setFichaCampo("CAPFILA",null);

      this.listVehiculo[columna-1].setFichaCampo("SEGAIRBAGS",null);
      this.listVehiculo[columna-1].setFichaCampo("SEGABS",null);

      this.listVehiculo[columna-1].setFichaCampo("EQUIESPEJOSELEC",null);
      this.listVehiculo[columna-1].setFichaCampo("EQUIBLOQUEO",null);
      this.listVehiculo[columna-1].setFichaCampo("EQUIAIRE",null);

  }
  loadDataVehiculo(columna:number,result:any){
    this.remover[columna] = true;
    this.listVehiculo[columna-1].setDataLinea(
      result.lineData.codigo,
      result.lineData.descripcion,
      result.lineData.traccion_nombre,
      result.lineData.cajacambios_nombre,
      result.lineData.tipomotor_nombre,
      result.lineData.capacidadmotor_nombre,
      result.lineData.foto_url,
      result.lineData.venta_valor
    );
    //GET INFORMACION DE LA FICHA TECNICA
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio + '?_p_action=_nuevodetalle', 
      {
        p_codigo:result.lineData.codigo+result.lineData.venta_modelo,
        p_operacion:'getfichatecnicadetalle'
      }
    )
    .then(result => {
      /*let items_ficha:any;
      items_ficha=result.datos;
      //items_ficha_total=result.registros 
      items_ficha.forEach(element => {
        let arr=[];
        if(this.fichatecnica.get(element.gruptec_nombre)==undefined){
            items_ficha.forEach(element2 => {
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
      });*/

      result.datos.forEach(element => {
        if(element.asptec_codigo=='8')this.listVehiculo[columna-1].setFichaCampo("TIPOCOMBUSTIBLE",element.fictec_valor);
        if(element.asptec_codigo=='9')this.listVehiculo[columna-1].setFichaCampo("POTENCIAMAXIMA",element.fictec_valor);
        if(element.asptec_codigo=='7')this.listVehiculo[columna-1].setFichaCampo("NUMEROCILINDROSTIPOCOMBUSTIBLE",element.fictec_valor);
        if(element.asptec_codigo=='11')this.listVehiculo[columna-1].setFichaCampo("TORQUE",element.fictec_valor);
        if(element.asptec_codigo=='6')this.listVehiculo[columna-1].setFichaCampo("CILINDRADA",element.fictec_valor);
        if(element.asptec_codigo=='119')this.listVehiculo[columna-1].setFichaCampo("TRACCION",element.fictec_valor);
        if(element.asptec_codigo=='16')this.listVehiculo[columna-1].setFichaCampo("CAJAVELOCIDADES",element.fictec_valor);
        if(element.asptec_codigo=='15')this.listVehiculo[columna-1].setFichaCampo("CAJATIPO",element.fictec_valor);
        if(element.asptec_codigo=='118')this.listVehiculo[columna-1].setFichaCampo("DIRECCIONTIPO",element.fictec_valor);

        if(element.asptec_codigo=='121')this.listVehiculo[columna-1].setFichaCampo("SUSPECIONTRA",element.fictec_valor);
        if(element.asptec_codigo=='120')this.listVehiculo[columna-1].setFichaCampo("SUSPECIONDEL",element.fictec_valor);

        if(element.asptec_codigo=='26')this.listVehiculo[columna-1].setFichaCampo("DIMDISTANCIAEJES",element.fictec_valor);
        if(element.asptec_codigo=='24')this.listVehiculo[columna-1].setFichaCampo("DIMALTO",element.fictec_valor);
        if(element.asptec_codigo=='25')this.listVehiculo[columna-1].setFichaCampo("DIMANCHO",element.fictec_valor);
        if(element.asptec_codigo=='23')this.listVehiculo[columna-1].setFichaCampo("DIMLARGO",element.fictec_valor);
	
	      if(element.asptec_codigo=='113')this.listVehiculo[columna-1].setFichaCampo("CAPPASAJEROS",element.fictec_valor);
        if(element.asptec_codigo=='110')this.listVehiculo[columna-1].setFichaCampo("CAPVACIO",element.fictec_valor);
        if(element.asptec_codigo=='111')this.listVehiculo[columna-1].setFichaCampo("CAPCARGA",element.fictec_valor);
        if(element.asptec_codigo=='115')this.listVehiculo[columna-1].setFichaCampo("CAPFILA",element.fictec_valor);

	      if(element.asptec_codigo=='33')this.listVehiculo[columna-1].setFichaCampo("SEGAIRBAGS",element.fictec_valor);
        if(element.asptec_codigo=='32')this.listVehiculo[columna-1].setFichaCampo("SEGABS",element.fictec_valor);

        if(element.asptec_codigo=='39')this.listVehiculo[columna-1].setFichaCampo("EQUIESPEJOSELEC",element.fictec_valor);
        if(element.asptec_codigo=='125')this.listVehiculo[columna-1].setFichaCampo("EQUIBLOQUEO",element.fictec_valor);
        if(element.asptec_codigo=='37')this.listVehiculo[columna-1].setFichaCampo("EQUIAIRE",element.fictec_valor);
        
      });  
      // console.log("FICC",result.datos);
      //this.listVehiculo[columna-1].setFicha(result.datos);
    })
    .catch(error => {
      alert(error._body)    
    });
    //console.log("grupoficha",this.grupoficha) ;   
  }

}
