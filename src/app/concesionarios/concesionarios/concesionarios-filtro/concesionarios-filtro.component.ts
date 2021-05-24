import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-concesionarios-filtro',
  templateUrl: './concesionarios-filtro.component.html',
  styleUrls: ['./concesionarios-filtro.component.css']
})
export class ConcesionariosFiltroComponent implements OnInit {
  // VARIABLES
  filciu = false;
  p_filtros:any   = {
    p_ciudad: undefined,
    p_search: undefined
  };
  ciudades:any    = [];


  // INPUTS Y OUTPUTS
  @Output() concesionarios  = new EventEmitter();
  @Output() filter          = new EventEmitter();
  @Output() reload          = new EventEmitter();

  constructor(
    private WebApiService:WebApiService,
    private route:ActivatedRoute,
    private router:Router
  ){ }

  ngOnInit(){
    window.scrollTo(0 ,0);
    this.route.queryParams.subscribe(params=>{
      this.p_filtros['p_ciudad'] = params['p_ciudad'];
      this.sendRequest();
    })
  }

  sendRequest(){
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action:'_get_concesionarios',
      p_filtro:'GETCIUDAD'
    })
    .subscribe(
      data=>{
        this.ciudades = data.datos;
        // establezco seleccionados.
        if(this.p_filtros.p_ciudad != undefined){
          let ciudadesSelected = this.p_filtros.p_ciudad.split(",");
          //establezco los seleccionados por url
          this.ciudades.map( (item)=>{
            if(ciudadesSelected.indexOf(item.codigo) != -1){
              item.selected = true;
            }else{
              item.selected = false;
            }
          })
        }else{
          this.ciudades.map((item)=>{
            item.selected = false;
          })
        }
      },
      error=>{
        console.log(error);
      }
    )
  }

  /**
   * @description     Metodo usado para manejar cambios en los filtros.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   */
  changes(){
    this.procesar_filtros();
    let input;
    input = document.querySelector('#search_concesionario');
    input.value = '';
    this.reload.emit(this.p_filtros);
  }

  /**
   * @description     Metodo usado para procesar los filtros.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   */
  procesar_filtros(){
    // mapeo ciudades seleccionadas.
    let ciudadesSelected = Array();
    this.ciudades.map(item=>{
      if(item.selected){
        ciudadesSelected.push(item.codigo);
      }
    });
    this.p_filtros.p_ciudad = ciudadesSelected.join(",");
  }

  /**
   * @description     Metodo usado para deseleccionar los filtros aplicados.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   */
  deselectAll(){
    this.p_filtros = {};
    let input;
    input = document.querySelector('#search_concesionario');
    input.value = '';
    this.router.navigate(['/concesionarios'], { queryParams: this.p_filtros });
    this.reload.emit(this.p_filtros);
  }

  /**
   * @description     Metodo de busqueda de concesionarios.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           06-02-2020
   */
  buscar_concesionario(e){
    let search = e.target.value;
    this.concesionarios.emit(search);
  }

  closeFilter(){
    this.filter.emit('close');
  }

}