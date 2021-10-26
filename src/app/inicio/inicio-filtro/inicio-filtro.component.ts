import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-filtro',
  templateUrl: './inicio-filtro.component.html',
  styleUrls: ['./inicio-filtro.component.css']
})
export class InicioFiltroComponent implements OnInit {
  
  // VARIABLES
  busquedaForm: FormGroup;
  p_filtros:any   = [];
  data:any        = [];

  // data
  clases;
  marcas;
  familias;
  clasificados;
  modelos;
  ubicacion;

  constructor(
    private fb:FormBuilder,
    private WebApiService:WebApiService,
    private router:Router
  ){
    this.busquedaForm = fb.group({
      ftipo:     new FormControl(''),
      fmarca:    new FormControl(''),
      ffamilia:  new FormControl(''),
      fmodelo:   new FormControl(''),
      fdepartamento:new FormControl(''),
      fclase:    new FormControl('')
    });
  }

  ngOnInit() {
    this.sendRequest();
    window.scrollTo(0,0);
  }
  ngAfterViewInit(){
    window.scrollTo(0,0);
  }




  sendRequest(){
    this.WebApiService.getRequest(AppComponent.urlService,
      Object.assign({
        _p_action:'_getItemsUsado2019'
      },this.p_filtros))
    .subscribe(
      data=>{
        this.clases         = data.fclase;
        this.marcas         = data.fmarca;
        this.familias       = data.ffamilia;
        this.clasificados   = data.ftipoclasificado;
        this.modelos        = data.fmodelo;
        this.ubicacion      = data.fdepartamento;
      },
      error=>{
        console.log(error);
      }
    )
  }
  sendSearch(){     
    this.p_filtros['p_clase']             = this.busquedaForm.get('fclase').value;
    this.p_filtros['p_marca']             = this.busquedaForm.get('fmarca').value;
    this.p_filtros['p_familia']           = this.busquedaForm.get('ffamilia').value;
    this.p_filtros['p_tipoclasificado']   = this.busquedaForm.get('ftipo').value;
    this.p_filtros['p_anno']              = this.busquedaForm.get('fmodelo').value;
    this.p_filtros['p_departamento']      = this.busquedaForm.get('fdepartamento').value;
    this.router.navigate(['clasificados'], { queryParams: this.p_filtros });
  }

  change(){
    this.p_filtros['p_clase']           = this.busquedaForm.get('fclase').value;
    this.p_filtros['p_marca']           = this.busquedaForm.get('fmarca').value;
    this.p_filtros['p_familia']         = this.busquedaForm.get('ffamilia').value;
    this.p_filtros['p_tipoclasificado'] = this.busquedaForm.get('ftipo').value;
    this.p_filtros['p_anno']            = this.busquedaForm.get('fmodelo').value;
    // this.p_filtros['p_departamento']    = this.busquedaForm.get('fdepartamento').value;
    // console.log(this.p_filtros);
    this.sendRequest();
  }
  
}
