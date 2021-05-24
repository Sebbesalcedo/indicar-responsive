import { Component, OnInit, Inject } from '@angular/core';
import { WebApiService } from '../../servicios/web-api.service';
import { AppComponent } from '../../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { EncabezadoComponent } from 'src/app/components/encabezado.component';


@Component({
  selector: 'app-concesionarios',
  templateUrl: './concesionarios.component.html',
  styleUrls: ['./concesionarios.component.css']
})
export class ConcesionariosComponent implements OnInit {
  //VARIABLES
  public loading    = false;
  items:any         = [];
  registros:number  = 0;
  page:number       = 1;
  p_filtros:any     = {};
  filtros          = {
    p_orderby:  '',
    p_ciudad:   '',
    p_search:   ''
  };
  itemsRespaldo:any = [];

  constructor(
    private WebApiService:WebApiService,
    private route:ActivatedRoute,
    private router:Router,
    @Inject(EncabezadoComponent) public encabezado:EncabezadoComponent
  ){ }

  ngOnInit() {
    window.scrollTo(0,0);
    this.viewFiltros(true);
    this.route.queryParams.subscribe(params=>{
      this.p_filtros['p_ciudad'] = params['p_ciudad'];
      if(params['currentPage'] != undefined || params['currentPage'] != ''){
        this.page = params['currentPage'];
      }
      this.sendRequest();
    })
  }

  sendRequest(){
    window.scrollTo(0,0);
    this.loading = true;
    this.WebApiService.getRequest(AppComponent.urlService,
      Object.assign({
        _p_action:'_get_concesionarios',
        currentPage : this.page,
        sizePage    : AppComponent.sizePage
      },this.p_filtros)
    )
    .subscribe(
      data=>{
        this.items            = data.datos;
        this.itemsRespaldo    = data.datos;
        this.registros        = data.registros;
        this.loading          = false;
      },
      error=>{
        console.log(error);
        this.loading = false;
      }
    )
  }
  
  /**
   * @description     Metodo usado para recargar la pagina aplicando los filtros necesarios.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   */
  reload(filtros=null){
    if(filtros != null){
      this.p_filtros = filtros;
    }
    this.encabezado.sidebarShowFilters = false;
    this.router.navigate(['/concesionarios'], { queryParams: this.p_filtros });
    this.sendRequest();
  }

  /**
   * @description     Metodo usado para cambios de paginas.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   */
  setPage(page:number){
    this.loading = true;
    this.page = page;
    this.p_filtros['currentPage'] = page;
    this.reload();
  }

  /**
   * @description     Metodo usado para buscar los concesionarios aplicado en los filtros.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           06-02-2020
   * @param           search String con busqueda para filtrado.
   */
  buscarConcesionarios(search){
    this.items = this.itemsRespaldo;
    this.items = this.items.filter(item =>{ 
      if(item.concesionario.toUpperCase().search(search.toUpperCase()) != -1){
        return item;
      }
    });
  }
  
  /**
   * @description     Metodo usado para mostrar y ocultar boton de filtros responsives.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   */
  viewFiltros(view:boolean){
    let filter = document.querySelector("#btn-filtros");
    if(document.contains(filter)){
      if(view){
        filter.classList.remove('noview');
      }else{
        filter.classList.add('noview');
      }
    }
  }

  clearFilter(){
    this.p_filtros = {};
    this.router.navigate(['/concesionarios'], { queryParams: this.p_filtros });
  }

  closeFilter($event){
    if($event == 'close'){
      this.encabezado.sidebarShowFilters = false;
    }
  }


  ngOnDestroy(){
    this.viewFiltros(false);
    this.encabezado.clearSearch();
  }

}
