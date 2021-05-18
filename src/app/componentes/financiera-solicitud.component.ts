import { Component, OnInit, ViewChild } from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DataSource } from '@angular/cdk/table';

import { MatPaginator, MatTableDataSource, MatSort, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material';
import { User, PersonaFinanciacion } from '../interface/User.interface';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { AlertService } from '../servicios/Alert.servicio';

@Component({
  templateUrl: '../templates/financiera.solicitud.template.html',
  styleUrls: ['../css/financia.css'],
  selector: 'financiera.solicitud.template',
  /*providers: [
   {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
 ],*/
})
export class FinancieraSolicitudComponent implements OnInit {
  detalle;
  //FORMULARIOS
  form_calculador: FormGroup;
  valor_financiar:number = 0 ;
  plazo_financiar:number = 0 ;
  cuota_financiar:number = 0 ;
  tasa_financiar:number  = 23.8721 ;
  isValidCuota = false;



//tabla
  displayedColumns = ['logo','entidad', 'producto', 'interesMin', 'interesMax', 'plazo', 'boton']; 
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }





  public mask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

  //public date = ['', /[1-9]/, /\d/, /\d/, '/', /[1-9]/, /\d/, /\d/, '/' , /[1-9]/, /\d/, /\d/, /\d/, /\d/]
  public numberMask = createNumberMask({
    prefix: '',
    suffix: '' // This will put the dollar sign at the end, with a space.
  });

  @ViewChild(MatSort) sort: MatSort;


  persona: PersonaFinanciacion = {
    nombrecompleto: '',
    fechanacimiento: '',
    tipodocumento: '',
    numerodocumento: '',
    perfil: '',
    fechaingreso: '',
    tipocontrato: '',
    cuotainicial: '',
    valorcredito: '',
    valorvehiculo: '',
    plazo: '',
    ingreos: '',
    telefono: '',
    ciudad: '',
    correo: '',
    confirmacioncorreo: '',
    politica: ''
  }

  constructor(
    private fb: FormBuilder,
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.init_forms();    
    if (this.route.snapshot.paramMap.get('tipo') != null) {     
      if(this.route.snapshot.paramMap.get('tipo')=='nuevo'||this.route.snapshot.paramMap.get('tipo')=='usado'){
        this.get_record(this.route.snapshot.paramMap.get('tipo'),this.route.snapshot.paramMap.get('id'))
      }
    }
  }
  get_record(tipo:string,id:string){
    if(tipo=='nuevo'){
        //GET INFORMACION DE LA LINEA
        this.promiseService.getServiceWithComplexObjectAsQueryString(
          AppComponent.urlservicio + '?_p_action=_nuevodetalle', 
          {
            p_codigo:id
          }
        )
        .then(result => {
          this.detalle=result.datos;  
          console.log("DETALLEXCAr",this.detalle)  
          this.form_calculador.get('valor_vehiculo').setValue(this.detalle[0].linea_precio);
          this.form_calculador.get('cuota_inicial').setValue(0);
          this.form_calculador.get('tipo_vehiculo').setValue("NU");
          this.form_calculador.get('tipo_servicio').setValue("PA");
          this.valor_financiar =this.detalle[0].linea_precio;
           
        })
        .catch(error => {
          alert(error._body)    
        }); 
    }else{
        //GET INFORMACION DE LA LINEA
        this.promiseService.getServiceWithComplexObjectAsQueryString(
          AppComponent.urlservicio + '?_p_action=_usadodetalle', 
          {
            p_codigo:id
          }
        )
        .then(result => {
          this.detalle=result.datos;  
          console.log("DETALLEXCArUSADOS",this.detalle)  
          this.form_calculador.get('valor_vehiculo').setValue(this.detalle[0].venta_valor);
          this.form_calculador.get('cuota_inicial').setValue(0);
          this.form_calculador.get('tipo_vehiculo').setValue("US");
          this.form_calculador.get('tipo_servicio').setValue("PA");
          this.valor_financiar =this.detalle[0].venta_valor;
        })
        .catch(error => {
          alert(error._body)    
        }); 
    }    
  }  
  init_forms() {
    this.form_calculador = this.fb.group({
      valor_vehiculo: new FormControl('', [
        Validators.required,
        Validators.maxLength(11)
      ]),
      cuota_inicial: new FormControl('', [
        Validators.required,
        Validators.maxLength(11)
      ]),
      /*tasaInteres: new FormControl('', [
        Validators.required
      ]),*/
      plazos: new FormControl('', [
        Validators.required
      ]),
      tipo_vehiculo:new FormControl('', [
        Validators.required
      ]),
      tipo_servicio:new FormControl('', [
        Validators.required
      ])

    });
  }

  onChange(evt) {    
    let valor=this.form_calculador.get("valor_vehiculo").value.replace(/\D+/g, '');
    //let cuota=this.form_calculador.get("cuota_inicial").value.replace(/\D+/g, '');
    var cuota=this.form_calculador.get("cuota_inicial").value;
    
    if(valor == '')cuota= 0;
    if(cuota == '')cuota= 0;
    cuota= cuota.replace(/\D+/g, '');
    this.valor_financiar = valor - cuota ; 
  }
  payment(i,n,VA,S){           
    let den=( 1.0+ (i*S/100.0) ) *(1.0 - Math.pow(1.0+(i/100.0),(n*(-1))) ) / (i/100.0);
    let PAGO=VA/den;
    return (PAGO*(1.0));
  }
    
  onCalcular(){
    this.isValidCuota=false;
    this.alertService.clear();
    if(this.valor_financiar<=0){
      this.alertService.error('Valor a Financiar debe ser mayor a 0');
      return false;
    }
    //console.log("ARRRR1",this.form_calculador.valid);
    if(this.form_calculador.valid){
      //this.valor_financiar;
      this.plazo_financiar = this.form_calculador.get("plazos").value;
      this.cuota_financiar = this.payment(1.0,(this.plazo_financiar*12),this.valor_financiar,0);
      //this.cuota_financiar = ( this.valor_financiar / (this.plazo_financiar*12) ) * 1.10 ;
      this.tasa_financiar  = 2.22 ;
      this.tasa_financiar  = 1.0 ;
      //console.log("ARRRR","123");     
      this.isValidCuota=true;
    }
    //this.alertService.error('XCAR');
 
    //Set the icon for the alert type
    /*
      type - Alert Type ( warn )
      icon - Setting Type
      value - Value of Google Icon font ( https://material.io/icons/ )
    */
  
    
  }

  onSubmit({ value, valid }: { value: User, valid: boolean }) {
    console.log(value, valid);
  }

}
export interface Element {
  entidad: string;
  producto: string;
  interesMin: string;
  interesMax: string;
  plazo:string;
}
const ELEMENT_DATA: Element[] = [
  {entidad:'BANCO DAVIVIENDA S.A.', producto: 'Crédito de Vehículo sin Prenda', interesMin:'1,22 %', interesMax: '1,69 %', plazo:'72 Mes(es)'},
  {entidad:'BANCO DAVIVIENDA S.A.', producto: 'Crédito de Vehículo sin Prenda', interesMin:'1,22 %', interesMax: '1,69 %', plazo:'72 Mes(es)'},
  {entidad:'BANCO DAVIVIENDA S.A.', producto: 'Crédito de Vehículo sin Prenda', interesMin:'1,22 %', interesMax: '1,69 %', plazo:'72 Mes(es)'},
 
];

