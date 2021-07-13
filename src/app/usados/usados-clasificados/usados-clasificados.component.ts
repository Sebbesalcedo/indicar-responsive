import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// servicios
import {WebApiService } from './../../servicios/web-api.service';
import { EncryptService } from './../../servicios/encrypt.service';
// componentes
import { AppComponent } from './../../../app/app.component';
// DEPENDENCIAS
import {MatSnackBar} from '@angular/material/snack-bar';
import { EncabezadoComponent } from 'src/app/components/encabezado.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-usados-clasificados',
  templateUrl: './usados-clasificados.component.html',
  styleUrls: ['./usados-clasificados.component.css']
})
export class UsadosClasificadosComponent implements OnInit {

  public loading          = false;
  // variables
  datos:any               = [];
  items:any               = [];
  registros:number        = 0;
  page:number             = 1;
  cuser:any               = null;
  isConcesionario:boolean = false;  // indica que se trata de la vista de un concesionario muestra header personalizado.
  dataCliente:any         = [];     // informacion del concesionario

  // comparador
  listVehiculosComparar   = [];

  // variables compartidas con componente hijo.
  ftipoclasificado        = [];
  fclase                  = [];
  fmarca                  = [];
  ffamilia                = [];
  fdepartamento           = [];
  fciudad                 = [];
  fprecio                 = [];
  fmodelo                 = [];
  fkm                     = [];
  ftraccion               = [];
  fcaja                   = [];
  ftipomotor              = [];
  fcapacidadmotor         = [];
  funicoduenio            = [];
  fplaca                  = [];
  fairbags                = [];
  fcliente                = [];

  // FILTROS
  p_filtros               = {
    'p_orderby':''
  };

  constructor(
    private WebApiService:WebApiService,
    private route:ActivatedRoute,
    private router:Router,
    private encrypt:EncryptService,
    private snackBar:MatSnackBar,
    @Inject(EncabezadoComponent) public encabezado:EncabezadoComponent
  ){}

  ngOnInit() {
    this.viewFiltros(true);
    this.listVehiculosComparar = JSON.parse(localStorage.getItem('setCompare'));
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.listVehiculosComparar == null){
      this.listVehiculosComparar = [];
    }
    this.route.queryParams.subscribe(params=>{
      this.p_filtros['p_tipoclasificado']     = params['p_tipoclasificado'];
      this.p_filtros['p_clase']               = params['p_clase'];
      this.p_filtros['p_marca']               = params['p_marca'];
      this.p_filtros['p_familia']             = params['p_familia'];
      this.p_filtros['p_departamento']        = params['p_departamento'];
      this.p_filtros['p_ciudad']              = params['p_ciudad'];
      this.p_filtros['p_unico']               = params['p_unico'];
      this.p_filtros['p_placatermina']        = params['p_placatermina'];
      this.p_filtros['p_airbags']             = params['p_airbags'];
      this.p_filtros['p_orderby']             = params['p_orderby'];
      this.p_filtros['p_descripcion']         = params['p_descripcion'];
      this.p_filtros['p_cliente']             = params['p_cliente'];
      this.p_filtros['currentPage']           = params['currentPage'];
      this.p_filtros['p_cliente']             = params['p_cliente'];
      if(params['p_cliente'] != null && params['p_cliente'] != undefined && params['p_cliente'] != '' ){
        this.isConcesionario = true;
        this.fcliente = params['p_cliente'];
      }else{
        this.isConcesionario = false;
        this.fcliente = null;
      }
      this.sendRequest();
    })

    // this.route.queryParams.subscribe(params=>{
    //   this.filtros['p_marca']               = params['p_marca'];
    //   this.filtros['p_familia']             = params['p_familia'];
    //   this.filtros['p_anno']                = params['p_anno'];
    //   this.filtros['p_departamento']        = params['p_departamento'];
    //   this.filtros['p_clase']               = params['p_clase'];
    //   this.filtros['p_forma']               = params['p_forma'];
    //   this.filtros['p_caja']                = params['p_caja'];
    //   this.filtros['p_modelodesde']         = params['p_modelodesde'];
    //   this.filtros['p_modelohasta']         = params['p_modelohasta'];
    //   this.filtros['p_traccion']            = params['p_traccion'];
    //   this.filtros['p_tipomotor']           = params['p_tipomotor'];
    //   this.filtros['p_capacidadmotor']      = params['p_capacidadmotor'];
    //   this.filtros['p_preciodesde']         = params['p_preciodesde'];
    //   this.filtros['p_preciohasta']         = params['p_preciohasta'];
    //   this.filtros['p_kmdesde']             = params['p_kmdesde'];
    //   this.filtros['p_kmhasta']             = params['p_kmhasta'];
    //   this.filtros['p_capacidadmotordesde'] = params['p_capacidadmotordesde']
    //   this.filtros['p_capacidadmotorhasta'] = params['p_capacidadmotorhasta']
    //   this.filtros['p_ciudad']              = params['p_ciudad'];
    //   this.filtros['p_placatermina']        = params['p_placatermina'];
    //   this.filtros['p_cliente']             = params['p_cliente'];
    //   this.filtros['p_tipoclasificado']     = params['p_tipoclasificado'];
    //   this.filtros['p_orderby']             = params['p_orderby'];
    //   this.filtros['p_descripcion']         = params['p_descripcion'];
    //   this.filtros['p_unico']               = params['p_unico'];
    //   this.filtros['p_airbags']             = params['p_airbags'];
    //   this.filtros['currentPage']           = params['currentPage'];

    //    // pagina identificada en la url
    //   //  this.pageURL                            = params['currentPage'];
    //   //  if(params['currentPage'] == null){
    //   //    this.infoPaginator = {'page':1};
    //   //  }else{
    //   //    this.infoPaginator = {'page':this.pageURL};
    //   //  }
    //   //  this.sendRequest(this.p_filtros['currentPage']);
    //    window.scrollTo(0, 0);

    //   // ejecutar consulta 
    //   console.log(this.filtros);

    // })

    // this.sendRequest();
  }

  sendRequest(){
    this.loading = true;
    this.WebApiService.getRequest(AppComponent.urlService+'?_p_action=_getItemsUsado2019',
      this.p_filtros
    )
    .subscribe(
      data=>{
        this.datos            = data;
        this.items            = data.datos;
        this.registros        = data.registros;
        this.ftipoclasificado = data.ftipoclasificado;
        this.fclase           = data.fclase;
        this.fmarca           = data.fmarca;
        this.ffamilia         = data.ffamilia;
        this.fdepartamento    = data.fdepartamento;
        this.fciudad          = data.fciudad;
        this.fprecio          = data.fprecio;
        this.fmodelo          = data.fmodelo;
        this.fkm              = data.fkm;
        this.ftraccion        = data.ftraccion;
        this.fcaja            = data.fcaja;
        this.ftipomotor       = data.ftipomotor;
        this.fcapacidadmotor  = data.fcapacidadmotor;
        this.funicoduenio     = data.funicoduenio;
        this.fplaca           = data.fplaca;
        this.fairbags         = data.fairbags;
        // telefonos concesionario o cliente
        let auxTelefonos        = [];
        if(data.cliente.data != undefined){
          let telefonos = JSON.parse(data.cliente.data);
          for(let item in telefonos){
            if(auxTelefonos.indexOf(telefonos[item].f2) == -1){
              auxTelefonos.push(telefonos[item].f2);
            }
          }
          if(data.cliente.cliente_url != '' && data.cliente.cliente_url != undefined){
            if(data.cliente.cliente_url.substr(0,4) != 'http'){
              data.cliente['cliente_url_visible'] = data.cliente.cliente_url;
              data.cliente.cliente_url = 'http://'+data.cliente.cliente_url;
            }else{
              data.cliente['cliente_url_visible'] = data.cliente.cliente_url;
            }
          }
          data.cliente.telefonos  = auxTelefonos;
          this.dataCliente        = data.cliente;
        }
        this.loading = false;

        // ENCRIPTADO DE CODIGO DE VENTA.
        if(this.items != undefined){
          this.items.map(item=>{
            item.venta_codigo = this.encrypt.encrypt(item.venta_codigo);
          });
        }
        
      },
      error=>{
        this.loading = false;
        console.log(error);
      }
    )
  }

  reload(filtros=null){
    if(filtros != null){
      this.p_filtros = filtros;
    }
    if(this.isConcesionario){
      if(this.fcliente != null){
        this.p_filtros['p_cliente']= this.fcliente;
      }
    }
    this.encabezado.sidebarShowFilters = false;
    this.router.navigate(['clasificados'], { queryParams: this.p_filtros });
    this.sendRequest();
  }
  setPage(page:number){
    this.loading = true;
    this.page = page;
    this.p_filtros['currentPage'] = page;
    this.reload();
  }

  clearFilter(){
    this.p_filtros = {
      p_orderby:''
    };
    this.reload();
  }

  reloadFilterOrder(){
    this.p_filtros['currentPage'] = 1;
    // this.reload();
    this.setPage(1)
  }



  // ######################################### FAVORITOS #########################################
  setFavorito(cod:string,index:number,nombre:string,status:string = null){
    event.stopPropagation();
    let setFavorite = JSON.parse(localStorage.getItem('setFavorite'));
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.cuser == null){ // debe iniciar sesion
      swal.fire({
        title: '',
        icon: null,
        text: 'Debe iniciar sesión para agregar a favoritos',
        showCloseButton:      true,
        showCancelButton:     true,
        confirmButtonColor:   '#3085d6',
        cancelButtonColor:    '#d33',
        confirmButtonText:    'Iniciar sesión',
        cancelButtonText:     'Cancelar'
      })
      .then(
        resp =>{
          if(resp.value == true){
            // establezco favorito en localstorage
            let objData = {
              cod:    cod,
              index:  index,
              nombre: nombre,
              status: status
            };
            let favorite = JSON.stringify(objData);
            localStorage.setItem('setFavorite',favorite);
            this.encabezado.login();
            let interval = setInterval(function(items){
              if(JSON.parse(localStorage.getItem('setFavorite'))== null){
                if(status == 'S'){
                  items[index].isfavorito = 'N';
                }else{
                  items[index].isfavorito = 'S';
                }
                clearInterval(interval);
              }
            },800,this.items,index);
          }else{

          }
        }
      )

      // establezco favorito en localstorage
      // let objData = {
      //   cod:    cod,
      //   index:  index,
      //   nombre: nombre,
      //   status: status
      // };
      // let favorite = JSON.stringify(objData);
      // localStorage.setItem('setFavorite',favorite);
      // this.encabezado.login();
      // if(status == 'S'){
      //   this.items[index].isfavorito = 'N';
      // }else{
      //   this.items[index].isfavorito = 'S';
      // }
    }else{  // usuario logueado.
      let codigo = this.encrypt.desencrypt(cod);
      let body = {
        venta_codigo: codigo
      }
      if(status == 'N'){ // agregar a favorito
        this.WebApiService.postRequest(AppComponent.urlService,body,{
          _p_action:'_clientefavorito'
        })
        .subscribe(
          data=>{
            this.items[index].isfavorito = 'S';
            this.snackBar.open('¡Agregado a favoritos!', null, {
              duration: 3000
            });
            localStorage.removeItem('setFavorite');
          },
          error=>{
            console.log(error);
          }
        );
      }else{  // eliminar de favoritos.
        this.WebApiService.deleteRequest(AppComponent.urlService,body,{
          _p_action:'_clientefavorito'
        })
        .subscribe(
          data=>{
            this.items[index].isfavorito = 'N';
            this.snackBar.open('¡Removido de favoritos!', null, {
              duration: 3000
            });
            localStorage.removeItem('setFavorite');
          },
          error=>{
            console.log(error);
          }
        );
      }
    }
    /*
    
    setFavorito(pcodigo:string, index: number, nombre: string,status:string = null): void {   
      var setFavorite = JSON.parse(localStorage.getItem('setFavorite'));
      if(JSON.parse(localStorage.getItem('currentUser')) == null){ // no logueado
        /*establezco el codigo en memoria,una vez sea logueado se redirije a clasificado con un mensaje
        de que su clasificado fue agregado a favorito*
        var logged = false;
        var objData = {pcodigo,index,nombre,status,logged};
        var stringData = JSON.stringify(objData);
        localStorage.setItem('setFavorite',stringData);
        this.router.navigate(['/login']);
      }else{// logueado
        // si vengo de loguearme.
        if(setFavorite != null){
          if(setFavorite.logged == false){ // viene de iniciar session
            // NO CONOZCO EL ID DEL CLASIFICADO.
            let cod = this.Encrypt.desencrypt(setFavorite.pcodigo);
            if(status == 'N'){ // clasificado 
              // console.log('entra4');
              this.promiseService.createService(
                AppComponent.urlservicio + '?_p_action=_clientefavorito',
                {
                  venta_codigo: cod
                }
              )
              .then(result => {         
                swal(
                  "",
                  'Vehículo agregado a favoritos',
                  null
                );
              })
              .catch(error => {
                swal(
                  "",
                  'Vehículo no pudo ser agregado a favoritos',
                  null
                );
              });  
            }
            localStorage.setItem('setFavorite',JSON.stringify(null));
          }
        }else{ // estoy en la pagina de clasificado agregando un favorito con la session iniciada.
          let cod = this.Encrypt.desencrypt(pcodigo);
          if(this.item[index].isfavorito=='S'){        
            this.promiseService.deleteService(
              AppComponent.urlservicio + '?_p_action=_clientefavorito',
              {
                venta_codigo: cod
              }
            )
              .then(result => {       
                  this.item[index].isfavorito = 'N';
              })
              .catch(error => {
                  this.item[index].isfavorito = 'S';
                  alert(error._body);             
              });
    
            this.snackBar.open('Removido de favoritos', null, {
              duration: 3000
            });
          }else{
            this.promiseService.createService(
              AppComponent.urlservicio + '?_p_action=_clientefavorito',
              {
                venta_codigo: cod
              }
            )
              .then(result => {       
                  this.item[index].isfavorito = 'S';
              })
              .catch(error => {
                  this.item[index].isfavorito = 'N';
                  alert(error._body)            
              });        
            this.snackBar.open('¡Agregado a favoritos!', null, {
              duration: 3000
            });
    
          } 
        }
      }
    }
    
    */
  }
  // ######################################### /FAVORITOS #########################################

  // ######################################### COMPARADOR #########################################
  setCompare(cod:string,index:number,nombre:string){
    event.stopPropagation();
    let tag;
    let snack;
    tag = event.target;
    if(tag.tagName == "I"){
      tag = tag.parentNode;
    }
    let compare = JSON.parse(localStorage.getItem('setCompare'));
    if(compare == null){ // creo storage
      compare = [];
      compare.push(cod);
      tag.classList.add('active');
    }else{ // agrego al storage ya existente.
      if(compare.indexOf(cod) == -1){ // si no existe lo agrego
        if(compare.length > 3){
          // console.log('No se pueden comparar más de 4 vehiículos');
          snack = this.snackBar.open('¡No se pueden comparar más de 4 vehículos!', "Ir al comparador", {
            duration: 5000
          });
          snack.onAction().subscribe(()=> this.goToCompare());
        }else{
          compare.push(cod);
          tag.classList.add('active');
          snack = this.snackBar.open('¡Agregado al comparador!', "Ir al comparador", {
            duration: 5000
          });
          snack.onAction().subscribe(()=> this.goToCompare());
        }
      }else{ // elimino
        compare = compare.filter(element=> {
          return element != cod
        });
        tag.classList.remove('active');
        snack = this.snackBar.open('¡Removido del comparador!', "Ir al comparador", {
          duration: 5000
        });
        snack.onAction().subscribe(()=> this.goToCompare());
      }
    }
    localStorage.setItem('setCompare',JSON.stringify(compare));



    
    /*let setFavorite = JSON.parse(localStorage.getItem('setFavorite'));
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.cuser == null){ // debe iniciar sesion
      // establezco favorito en localstorage
      let objData = {
        cod:    cod,
        index:  index,
        nombre: nombre,
        status: status
      };
      let favorite = JSON.stringify(objData);
      localStorage.setItem('setFavorite',favorite);
      this.encabezado.login();
      if(status == 'S'){
        this.items[index].isfavorito = 'N';
      }else{
        this.items[index].isfavorito = 'S';
      }
    }else{  // usuario logueado.
      let codigo = this.encrypt.desencrypt(cod);
      let body = {
        venta_codigo: codigo
      }
      if(status == 'N'){ // agregar a favorito
        this.WebApiService.postRequest(AppComponent.urlService,body,{
          _p_action:'_clientefavorito'
        })
        .subscribe(
          data=>{
            this.items[index].isfavorito = 'S';
            this.snackBar.open('¡Agregado a favoritos!', null, {
              duration: 3000
            });
            localStorage.removeItem('setFavorite');
          },
          error=>{
            console.log(error);
          }
        );
      }else{  // eliminar de favoritos.
        this.WebApiService.deleteRequest(AppComponent.urlService,body,{
          _p_action:'_clientefavorito'
        })
        .subscribe(
          data=>{
            this.items[index].isfavorito = 'N';
            this.snackBar.open('¡Removido de favoritos!', null, {
              duration: 3000
            });
            localStorage.removeItem('setFavorite');
          },
          error=>{
            console.log(error);
          }
        );
      }
    }*/
  }
  // ######################################### /COMPARADOR #########################################

  // FUNCIONES DE VISUALIZACION
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

  goToCompare(){
    this.router.navigate(['/comparador']);
  }

  ngOnDestroy(){
    this.viewFiltros(false);
    this.encabezado.clearSearch();
  }
  
  closeFilter($event){
    if($event == 'close'){
      this.encabezado.sidebarShowFilters = false;
    }
  }
}
