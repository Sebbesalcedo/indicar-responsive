import { Component, OnInit ,Input } from '@angular/core';
import { WebApiPromiseService }   from '../servicios/WebApiPromiseService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-usado-concesionario',
  templateUrl: '../templates/concesionario.template.html',
  styleUrls: ['../css/vitrina.css']
})
export class ConcesionarioComponent implements OnInit {
  @Input() cliente;
  @Input() telefonos;
  sub;
  //FILTROS
  p_filtros={};
  //RESULTADO
  items;
  total_items=100;
  constructor(
    private promiseService: WebApiPromiseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    /*
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.p_filtros['p_marca']= params['p_marca'];
      this.p_filtros['p_familia']= params['p_familia'];
      this.p_filtros['p_anno']= params['p_anno'];
      this.p_filtros['p_clase']= params['p_clase'];
      this.p_filtros['p_forma']= params['p_forma'];
      this.p_filtros['p_caja']= params['p_caja'];
      this.p_filtros['p_traccion']= params['p_traccion'];
      this.p_filtros['p_tipomotor']= params['p_tipomotor'];
      this.p_filtros['p_capacidadmotor']= params['p_capacidadmotor'];
      this.p_filtros['p_preciodesde']= params['p_preciodesde'];
      this.p_filtros['p_preciohasta']= params['p_preciohasta'];
      window.scrollTo(0, 0)
    });
    */
   //console.log("DATA CLIENTE",this.items);
  }
  ngOnDestroy() {
    //this.sub.unsubscribe();
  }
}
