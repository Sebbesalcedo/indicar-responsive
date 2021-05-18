import { Component, OnInit } from '@angular/core';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-nuevo',
  templateUrl: '../templates/nuevo.template.html'
  //,styleUrls: ['./heroes.component.css']
})
export class NuevoComponent implements OnInit {
  sub;
  public loading = false;
  //FILTROS
  p_filtros = {};
  //RESULTADO
  items;
  total_items = 100;
  filtroR=false;
  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.p_filtros['p_marca'] = params['p_marca'];
        this.p_filtros['p_familia'] = params['p_familia'];
        this.p_filtros['p_anno'] = params['p_anno'];
        this.p_filtros['p_clase'] = params['p_clase'];
        this.p_filtros['p_forma'] = params['p_forma'];
        this.p_filtros['p_caja'] = params['p_caja'];
        this.p_filtros['p_traccion'] = params['p_traccion'];
        this.p_filtros['p_tipomotor'] = params['p_tipomotor'];
        this.p_filtros['p_capacidadmotor'] = params['p_capacidadmotor'];
        this.p_filtros['p_preciodesde'] = params['p_preciodesde'];
        this.p_filtros['p_preciohasta'] = params['p_preciohasta'];

        this.p_filtros['p_orderby']= params['p_orderby'];
        this.sendRequest();
        window.scrollTo(0, 0)
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  sendRequest() {
    this.loading = true;
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_nuevo',
      Object.assign(
        this.p_filtros,
        {
          currentPage: 1,
          sizepage: AppComponent.paginasize
        }
      )
    )
      .then(result => {
        this.items = result.datos;
        this.total_items = result.registros
        this.loading = false;

         console.log("campos", this.items);
        //this.setPage(1);
      })
      .catch(error => {
        //console.log("ERROR123",error);
        alert(error._body)
        this.loading = false;
        //console.log(error)
      });
  }
  reload(): void {
    //alert('R2')
    //this.router.navigate(['nuevo'], { queryParams: this.p_filtros });
    //this.sendRequest();
  }



  setPage(paginador: any) {
    this.loading = true;
    //alert('R3')
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_nuevo',
      Object.assign(
        this.p_filtros,
        {
          currentPage: paginador.currentPage,
          sizePage: AppComponent.paginasize
        }
      )
    )
      .then(result => {
        this.items = result.datos;
       

        this.total_items = result.registros
        window.scrollTo(0, 0)
        this.loading = false;


      })
      .catch(error =>{ 
        //console.log(error)
        alert(error._body)
        this.loading = false;
      });
  }

}
