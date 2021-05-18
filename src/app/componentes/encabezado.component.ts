import { Component, OnInit, ElementRef, ViewChild, isDevMode } from '@angular/core';
import {NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { currentUser } from '../interface/currentuser.interface';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../servicios/AuthenticationService.servicio';
import { Event } from '@angular/router';
import { HostListener } from "@angular/core";
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';

import { AppComponent } from '../app.component';
import { timer } from 'rxjs/observable/timer';
@Component({
  selector: 'app-encabezado',
  templateUrl: '../templates/encabezado.template.html',
  styleUrls: ['../css/encabezado.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})

export class EncabezadoComponent implements OnInit {

  // Added by Daniel Bolivar
  info_cuenta:any;
  // activar(true) o desactivar(false) el comparador del sistema.
  comparador:boolean = true;

  closeResult: string;
  isClasificado: boolean = false;
  bt_busqueda_respo = "busqueda-contenido";
  filtro = "";
  public innerWidth: any;
  mUrl: string = '';

  modalReference: NgbModalRef;
  currentuser: currentUser;
  isLogged = false;
  btAtras = true;
  btAtrasActive = false;
  nameUser: string = '';
  headerNav = false;
  toggleSearch = false;
  palabra: string = '';
  urlPage;
  urlClasificado;

  cantComparador: number = 0;
  total_mensajes = 0;
  clasificadoRevision=0;
  clasificadoAprobados=0;
  clasificadoRechazados=0;
  clasificadoInactivos=0;
  clasificadoVendidos=0;

  subscribetimer:any;

  @ViewChild('buscador') nameField: ElementRef;
  buscadorFocus(): void {
    this.nameField.nativeElement.focus();
  }


  constructor(private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private promiseService: WebApiPromiseService,
    private authenticationService: AuthenticationService) {

    var div = document.getElementById("busqueda-contenido");

    this.bt_busqueda_respo = "boton-busqueda";

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {

        var urlAtras = (event.url.split("/")[2]);

        this.urlPage = (event.url.split("(")[0]);
        this.urlClasificado = (event.url.split("?")[0]);
        if (this.urlClasificado !== "/clasificados") {
          this.palabra = '';
        }

        if (urlAtras == "/clasificados/detalle") {
          this.palabra = '';
          //           console.log('atras', urlAtras)

        }


        if (this.urlClasificado === "/clasificados" || this.urlClasificado === "/nuevo" || event.url === "/libro_azul_nuevo" || event.url === "/libro_azul_usado" || this.urlPage === "/cuenta/") {
          //if (this.innerWidth < 768) {
          // console.log(this.urlPage, "hoola");
          this.isClasificado = true;
          this.mUrl = this.urlPage;
          this.innerWidth = window.innerWidth;
          //console.log("XCAR W",this.mUrl)

          if (this.innerWidth < 769) {
            this.isClasificado = true;
            this.bt_busqueda_respo = "boton-busqueda respon";
          }
          //}
        } else {
          this.bt_busqueda_respo = "boton-busqueda";

        }

        /*** probando detectar la ruta si tiene la palabra detalle**/


        /*if(this.urlClasificado == "/clasificados" || urlAtras == "/clasificados/detalle" || urlAtras == "/detalle" || this.urlPage == "/cuenta/"){
          console.log('atras');
        }else{
          console.log('normal', event.url, this.urlPage, this.urlClasificado, urlAtras)
        }*/

        if (urlAtras === "detalle") {
          // console.log('atras');
          this.btAtras = false;
          this.btAtrasActive = true;
        } else {
          this.btAtras = true;
          this.btAtrasActive = false;
        }
      }
    });

  }


  open(content) {
    //console.log("MODAL OPEN",content)
    this.modalReference = this.modalService.open(content);
    /*
    //  this.modalService.open(content).result.then((result) => {
       console.log("MODAL CLOSE")
       this.closeResult = `Closed with: ${result}`;
     }, (reason) => {
       console.log("MODAL CLOSE")
       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
     });*/
  }
  encodedStr(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
      return '&#' + i.charCodeAt(0) + ';';
    });
  }
  encodeHtmlEntity(str) {
    var buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
      buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
  }
  ngOnInit() {
    //console.log("CURRENTUSER",localStorage.getItem("currentUser"));
    this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentuser == null) {
      this.isLogged = false;
      this.nameUser = '';
    }
    else if ((this.currentuser.token || '') == "") {
      this.isLogged = false;
      this.nameUser = '';
    }
    else {
      var doc = new DOMParser().parseFromString(this.currentuser.name, "text/html");
      this.currentuser.name = doc.documentElement.textContent;
      this.nameUser = this.currentuser.name;
      this.isLogged = true;
    }
    var doc = new DOMParser().parseFromString(this.nameUser, "text/html");
    //alert(doc.documentElement.textContent);
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 1051) {
      this.toggleSearch = false;
    } else {
      this.toggleSearch = true;
    }
    this.operacionComparar();
    this.refreshMensajes();

    const source = timer(1000, 30000);
    this.subscribetimer = source.subscribe(val => {    
      //console.log("ENCABEZADO -> ",val);  
      this.getInfo();
    });
    // if(!isDevMode()){
    //   console.log = (...args)=>{}
    // }
  }
  ngOnDestroy() {   
    this.subscribetimer.unsubscribe();   
  }

  onResize(event) {
    //console.log("WITH",event.target.innerWidth); // window width

    this.innerWidth = window.innerWidth;
    /*if (this.innerWidth < 768) {

       console.log("width2=",this.mUrl);
        if(this.mUrl === "/clasificados" || this.mUrl === "/nuevo"){
            console.log(event, "hoola");
            this.isClasificado=true; 
            this.bt_busqueda_respo="boton-busqueda respon";
        }else{
          this.bt_busqueda_respo="boton-busqueda";
        }
    } else{
      this.bt_busqueda_respo="boton-busqueda";
    }*/

    //// LA LUPA SE CORRE CUANDO SE DESLIZA
    if (this.innerWidth < 768) {

      if (this.urlClasificado === "/clasificados" || this.urlClasificado === "/nuevo" || this.urlPage === "/libro_azul_nuevo" || this.urlPage === "/libro_azul_usado" || this.urlPage === "/cuenta/") {
        this.isClasificado = true;
        this.bt_busqueda_respo = "boton-busqueda respon";
        // console.log("sirvio");

      } else {
        this.bt_busqueda_respo = "boton-busqueda";

      }
    } else {
      this.bt_busqueda_respo = "boton-busqueda";

    }


    /*
          if (this.innerWidth > 1051) {
             this.toggleSearch=true;
          }else{
            this.toggleSearch;
          }
    */
  }
  public setLogin(evt) {
    if (evt == 'LOGINOK') {
      this.isLogged = true;
      this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
      this.nameUser = this.currentuser.name;
    }
  }
  public closeModal(evt) {
    if (evt == 'LOGINOK') {
      this.isLogged = true;
      this.currentuser = JSON.parse(localStorage.getItem("currentUser"));
      this.nameUser = this.currentuser.name;
    }
    //console.log("Modal",evt);
    this.modalReference.close();// .close();
  }
  //this.modalService.close();
  /*
  public isLogged(): boolean {
    //console.log("CU",this.currentuser)
    if(this.currentuser==null) return false;
    if((this.currentuser.token||'') == "") return false;
    else return true;
    //return this.currentuser.token||'';
  }
  */
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      //alert('you just clicked enter');
      this.router.navigate(['clasificados'], {
        queryParams: {
          p_descripcion: this.palabra
        }
      });
      // rest of your code
    }
  }

  btnBuscar(event) {

    this.router.navigate(['clasificados'], {
      queryParams: {
        p_descripcion: this.palabra
      }
    });
  }

  public logout(): void {//alert('4444');
    localStorage.removeItem('currentUser');
    this.isLogged = false;
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public operacionComparar() {
    let c_compare = null;
    if (localStorage.getItem('listVehiculosComparar') != undefined)
      c_compare = JSON.parse(localStorage.getItem('listVehiculosComparar'));
    if (c_compare != null) {
      this.cantComparador = c_compare.length;
    } else {
      this.cantComparador = 0;
    }
  }

  public refreshMensajes() {
    //RESULTADO 
    if (this.isLogged)
      this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
        AppComponent.urlservicio + '?_p_action=_cuenta_comentario',
        Object.assign(
          // this.p_filtros,
          {
            currentPage: 1,
            sizepage: AppComponent.paginasize
          }
        )
      )
        .then(result => {

          this.total_mensajes = result.registros


        })
        .catch(error => {
          alert(error._body);
          //this.error = error._body;
          // console.log("ERRRORRR",error._body)
        });
  }
  getInfo(){    
    //RESULTADO 
    this.promiseService.getServiceWithComplexObjectAsQueryString(
      AppComponent.urlservicio+'?_p_action=_getCuentaInicio', 
      {}
    )
    .then(result => {
      this.info_cuenta            = result.datos;
      this.total_mensajes         = result.datos[0].cant_comentarios;
      this.clasificadoRevision    = result.datos[0].cant_clasificadosrevision;
      this.clasificadoAprobados   = result.datos[0].cant_clasificadosaprobados;
      this.clasificadoRechazados  = result.datos[0].cant_clasificadosrechazados;
      this.clasificadoInactivos   = result.datos[0].cant_clasificadosfinalizados;
      this.clasificadoVendidos    = result.datos[0].cant_clasificadosvendidos;     
    })
    .catch(error => {
      alert(error._body);      
    }); 
  }




}

