import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { timer, Observable, Subscriber } from 'rxjs';
import { LoginDialog } from '../dialogs/login/login.dialog.component';
import { Router } from '@angular/router';
//Servicios
import { AuthenticationService } from '../servicios/authentication-service.service';
import { WebApiService } from '../servicios/web-api.service';
import { AppComponent } from '../app.component';
import { EncryptService } from '../servicios/encrypt.service';
// DEPENDENCIAS
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog } from '@angular/material';
import swal from 'sweetalert2';
import { RecomendadorDialog } from '../dialogs/recomendador/recomendador.dialog.component';

@Component({
  selector: 'app-encabezado',
  templateUrl: '../templates/encabezado.component.html',
  styleUrls: ['../css/encabezado.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class EncabezadoComponent implements OnInit {

  // VARIABLES
  public loading        = false;
  cuser:any;                                              // informacion usuario
  responsive:string     = '';                             // identifica el tipo de pantalla.
  sidebarShow:boolean   = false;                          // indica si mostrar el menu lateral - mobile.
  sidebarShowFilters    = false;                          // indica si mostrar el menu lateral de filtros - mobile
  user:string           = '';                             // nombre del usuario
  avatar:string         = "./assets/images/indicar.svg";  // avatar usuario por defecto
  isLogged:boolean      = false;                          // indica si hay un usuario logueado.
  searchActiveMobile    = false;                          // indica si esta abierta la barra de busqueda en movil.
  disable:boolean       = true;                           // indica que no puedo recuperar contraseña
  
  toggleSearch:boolean  = true;
  headerNav:boolean     = false;
  comparador:boolean    = true;
  // buscador
  @ViewChild('buscador',{static:false}) buscador:ElementRef;
  intervalSearch;

  // SEGURIDAD
  ieuf:any              = []; //acceso seguro, denota indicarequipo de uso frecuente.
  subscribetimer:any;
  userComprobate        = null; //activada despues del login.

  // CLASIFICADOS.
  aprobados:number      = 0;
  pendientes:number     = 0;
  rechazados:number     = 0;
  vendidos:number       = 0;
  inactivos:number      = 0;


  // COOKIES
  cookies = true;
  
  palabra:string = '';
  totalMensajes:number = 0;
  
  constructor(
    public dialog:MatDialog,
    private AuthenticationService:AuthenticationService,
    private router:Router,
    private WebApiService:WebApiService,
    private Encrypt:EncryptService,
    private snackBar:MatSnackBar
  ){ 
    this.isResponsive();
  }

  ngOnInit() {
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.cuser != '' && this.cuser != null){
      this.isLogged   = true;
      this.user       = this.cuser.name;
      this.avatar     = this.cuser.clienteimagen;
      this.userComprobate = true;
      this.AuthenticationService.setToken(this.cuser.token);
    }else{
      this.AuthenticationService.logout();
      this.isLogged = false;
    }
    if(this.isLogged){
      // agrego timer y subscripcion
      this.subscriberApp();
    }
  }
 

  // ############################################## registro, inicio de session y accesos seguros. ##############################################
  /**
   * @description   Metodo usado para subscribirme a la aplicacion y detectar inicio de session sospechosos asi como tambien datos en "tiempo real" 
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         18-01-2020
   */
  subscriberApp(){
    const source = timer(1000,30000);
    this.subscribetimer   = source.subscribe(val=>{
      this.secureLogin();
      if(this.cuser!= '' && this.cuser != null){
        this.getInfoCuenta();
      }
    });
  }

  /**
   * @description   Metodo usado para abrir modal de registro.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @return        objeto indicar si la conexion fue exitosa o no.
   */
  register(){
    var dialogRef = this.dialog.open(LoginDialog, {
      data: {
        window: 'register'
      }
    });
    dialogRef.disableClose = true;

    // activa el loading mientras identifica el usuario
    // LOADING
    dialogRef.componentInstance.loading.subscribe(val=>{
      this.loading = val;
    })
    // RETORNA RESULTADOS DE REGISTRO
    dialogRef.componentInstance.updateLoggedStatus.subscribe(val=>{
      this.loading = false;
      this.isLogged = false;
      if(typeof(val)=='object'){
        if(val.name != '' && val.name != undefined){
          this.avatar = val.p_clienteimagen;
          this.isLogged   = true;
          this.user       = val.name;
          this.cuser = JSON.parse(localStorage.getItem('currentUser'));
          let cuser;
          cuser = this.cuser;
          this.AuthenticationService.setToken(cuser.token);
          dialogRef.close();
          swal.fire({
            title: '<strong>Bienvenido a Indicar</strong>',
            icon: null,
            html:
              'Si deseas conocer como hacer tu primera publicación consulta '+
              '<a href="https://cdnprocessoft.s3.amazonaws.com/SITIOS/XuQlxMLqjS_vGRUP1rcXyNlDKh3dwzcsokrQU-C0s2w/indicar/INSTRUCTIVO-PUBLICAR-CLASIFICADOS-EN-INDICAR-PERSONA-NATURAL.pdf" target="_blank">aquí</a>',
            showCloseButton: true,
            confirmButtonText:'<i class="fa fa-thumbs-up"></i> Ok!'
          })
        }
      }else{
        console.log(val);
      }
    })
  }

  /**
   * @description   Metodo usado para abrir modal de login.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @return        objeto indicar si la conexion fue exitosa o no.
   */
  login(){
    // this.sidebarShow = !this.sidebarShow;
    this.sidebarShow = false;
    var dialogRef = this.dialog.open(LoginDialog, {
      data: {
        window: 'login'
      }
    });
    dialogRef.disableClose = true;
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   console.log(result);
    // });

    // LOADING
    dialogRef.componentInstance.loading.subscribe(val=>{
      // console.log('loading',val);
      this.loading = val;
    })
    // RETORNA SI EL LOGIN FUE EXITOSO.
    dialogRef.componentInstance.updateLoggedStatus.subscribe(val=>{
      this.loading = false;
      if(val.name != '' && val.name != undefined){
        this.avatar = val.p_clienteimagen;
        this.isLogged = true;
        this.user = val.name;
        this.cuser = JSON.parse(localStorage.getItem('currentUser'));
        let cuser;
        cuser = this.cuser;
        this.AuthenticationService.setToken(cuser.token);
        dialogRef.close();
        this.userComprobate = true;
        this.subscriberApp();
      }else{
        this.isLogged = false;
        this.userComprobate = true;
      }
    })

    // VERIFICAR FAVORITOS.
    dialogRef.componentInstance.setFavorite.subscribe(val=>{
      let setFavorite = JSON.parse(localStorage.getItem('setFavorite'));
      let cod = this.Encrypt.desencrypt(setFavorite.cod);
      let body = {
        venta_codigo: cod
      }
      if(setFavorite.status == 'N'){
        this.WebApiService.postRequest(AppComponent.urlService,body,{
          _p_action:'_clientefavorito'
        })
        .subscribe(
          data=>{
            this.snackBar.open('¡Agregado a favoritos!', null, {
              duration: 3000
            });
            localStorage.removeItem('setFavorite');
          },
          error=>{
            console.log(error);
          }
        );
      }else{
        this.WebApiService.deleteRequest(AppComponent.urlService,body,{
          _p_action:'_clientefavorito'
        })
        .subscribe(
          data=>{
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
    });

    // RECUPERAR PASSWORD
    dialogRef.componentInstance.recovery.subscribe(body=>{
      this.WebApiService.putRequest(AppComponent.urlService,body,{
        _p_action: '_recuperarpsw'
      })
      .subscribe(
        data=>{
          this.loading = false;
          swal.fire({
            title: '',
            icon: null,
            text: 'Se envió un e-mail para recuperar el acceso a INDICAR'
          });
        },
        error=>{
          console.log(error);
          this.loading = false;
        }
      );
    });
  }

  // SEGURIDAD
  /**
   * @description   Metodo usado para detectar el inicio de session sospechoso.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         18-01-2020
   */
  private secureLogin(){
    //verifico si existe session iniciada.
    if(this.isLogged){
      // variables
      // let tk      = null; // token
      // let exist   = false;// identifica si el usuario tiene token.
      // let idToken = null; // id del token dentro del arreglo de token's.
      let ieuf    = null; // localstorage
      let nsr     = JSON.parse(localStorage.getItem('nsr'));
      ieuf        = JSON.parse(localStorage.getItem('ieuf'));
      let usuario = JSON.parse(localStorage.getItem('currentUser'));
      let action  = null;
      
      //comprobamos si es un dispositivo de uso frecuente.
      if(nsr == null || nsr == 'null'){  // si distinto de null no se reporta ningun evento de ingreso.
        if(ieuf != null && ieuf != 'null' && ieuf != undefined){ // existen tokens.
          if(Array.isArray(ieuf)){
            let execute = true;
            ieuf.forEach((item,i)=>{ // token encontrado en la lista. se debe comprobar el token.
              if(item.username.toLowerCase() == usuario.username.toLowerCase()){
                action = "COMPROBATE_USER_CONTINUO";
                ieuf[i].action = action;
                execute = false;
                this.comprobarToken(ieuf,i,action);
              }
            });
            if(execute){  // creamos token. ya que este usuario no existe.
              this.createToken();
            }
          }
        }else{ // no existen tokens. deben crearse y reportar accesos.
          this.createToken();
        }
      }else{ // /nsr
        this.subscribetimer.unsubscribe();
      }
    }
  }

  /**
   * @description   Metodo usado para crear token de acceso seguro
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         18-01-2020
   */
  private createToken(){
    let ieuf = JSON.parse(localStorage.getItem('ieuf'));
    let time = new Date();
    let timeTk = time.getFullYear()+"-"+time.getMonth()+"-"+time.getDate()+"-"+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
    let tk = btoa(this.cuser.username+"eyJwYWdlIjoiaW5kaWNhciIsInRva2VuIjoiSW5kaWNhcjIwMTlFcXVpcG9EZVVzb0ZyZWN1ZW50ZSJ9"+timeTk); // encode de token con correo.
    if(ieuf == null){
      this.ieuf.push({
        username:this.cuser.username.toLowerCase(),
        token:tk
      });
      localStorage.setItem('ieuf',JSON.stringify(this.ieuf));      // establezco el token en memoria local.
    }else{ // mantengo los registros existentes y agrego los nuevos.
      ieuf.push({
        username:this.cuser.username.toLowerCase(),
        token:tk
      });
      localStorage.setItem('ieuf',JSON.stringify(ieuf));      // establezco el token en memoria local.
    }
    ieuf = JSON.parse(localStorage.getItem('ieuf'));
    let action = "CREATE_TOKEN";
    let idToken = ieuf.length-1;
    // SEND MAIL AND REGISTER DATABASE
    this.comprobarToken(ieuf,idToken,action);
  }
  /**
   * @description   Metodo usado para consultar en la base de dato si el usuario logueado es seguro. de lo contrario tumba la sesion activa.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         18-01-2020
   */
  private comprobarToken(token:any,idToken:number,action:string){
    let body;
    token[idToken].action = action;
    
    if(action == "CREATE_TOKEN"){ // creo token en DB. y envio email reportando acceso.
      body = {
        token: token[idToken]
      }
      // REQUEST
      this.WebApiService.postRequest(AppComponent.urlService,body,{
        _p_action:'_acceso_seguro'
      })
      .subscribe(
        data=>{
          // console.log("Correo de acceso inseguro enviado y registro de token en la base de dato. se registro: ");
        },
        error=>{
          console.log(error);
        }
      );
    }
    else if(action == "COMPROBATE_USER_CONTINUO"){
      body = {
        token: token[idToken]
      }
      // REQUEST
      this.WebApiService.postRequest(AppComponent.urlService,body,{
        _p_action:'_acceso_seguro'
      })
      .subscribe(
        data=>{
          if(data.success == "false"){
            let ieuf = JSON.parse(localStorage.getItem('ieuf'));
            ieuf = ieuf.filter(item=> item.username != this.cuser.username);
            localStorage.setItem('ieuf',JSON.stringify(ieuf));
            localStorage.removeItem('currentUser');
            this.isLogged = false;
            this.router.navigate(['/']);
          }
        },
        error=>{
          console.log(error);
        }
      );
    }
  }

  /**
   * @description   Metodo Usado para obtener informacion de la cuenta.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         30-01-2020
   */
  getInfoCuenta(){
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action: '_getCuentaInicio'
    })
    .subscribe(
      data=>{
        // console.log(data);
        let datos = data.datos[0];
        this.totalMensajes    = datos.cant_comentarios;
        this.aprobados        = datos.cant_clasificadosaprobados;
        this.pendientes       = datos.cant_clasificadosrevision;
        this.rechazados       = datos.cant_clasificadosrechazados;
        this.vendidos         = datos.cant_clasificadosvendidos;
        this.inactivos        = datos.cant_clasificadosfinalizados;
      },
      error=>{
        console.log(error);
      }
    )
  }

  /**
   * @description   Metodo Usado para el cierre de session.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   */
  logout(){
    // original
    this.isLogged = false;
    this.userComprobate = false;
    this.subscribetimer.unsubscribe();
    this.AuthenticationService.logout();
    this.router.navigate(['/']);
  }

  /**
   * @description   Metodo Usado para el cierre de session.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   */
  logoutMobile(){
    this.sidebarShow= !this.sidebarShow;
    this.isLogged = false;
    this.AuthenticationService.logout();
    this.router.navigate(['/']);
  }

  /**
   * @description   Metodo Usado para mostrar ventana de cambio de contraseña.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         31-101-2020
   * @param         token string  contiene token necesario para identificar el usuario
   */
  recoveryPassword(token:string){
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action:'_recuperarpsw',
      p_token:token
    }).subscribe(
      data=>{
        if(!data.success){
          swal.fire({
            title: '',
            text: 'Error en el Validacion '+data.mensaje,
            icon: null
          });
        }else{
          this.disable = false;
          var dialogRef = this.dialog.open(LoginDialog,{
            data: {
              window: 'recoveryPassword',
              disable: false
            }
          });
          // LOADING
          dialogRef.componentInstance.loading.subscribe(val=>{
            this.loading = val;
          })
          // UPDATE PASSWORD.
          dialogRef.componentInstance.putPassword.subscribe(val=>{
            let body = {
              form:         val,
              p_operacion:  'updatepasswordtoken',
              p_token:        token
            }
            this.WebApiService.putRequest(AppComponent.urlService,body,{
              _p_action:    '_cuentaconfigurar',
              p_operacion:  'updatepasswordtoken',
            })
            .subscribe(
              data=>{
                this.snackBar.open('Información actualizada', null,{
                  duration: 4000
                });
                dialogRef.close();
                this.router.navigate(['/inicio']);
                this.loading = false;
              },
              error=>{
                console.log(error);
                dialogRef.close();
                this.snackBar.open('Error al actualizar', null,{
                  duration: 4000
                });
                this.loading = false;
              }
            )
          });
        }
      },
      error=>{
        console.log(error);
      }
    );
    
  }
  /**
   * @description   Metodo Usado para cerrar el dialogo de cookies.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         04-02-2020
   */
  closeCookies(){
    this.cookies=false;
  }

  // ############################################## / registro, inicio de session y accesos seguros. ##############################################
  
  // BUSQUEDA DE DATOS
/**
   * @description     Metodo para realizar busqueda por entrada del usuario en la barra de busqueda.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           30-10-2019
   * @param           e evento de redimensionamiento de pantalla.
   */
  searchData(e){
    if(this.intervalSearch != undefined){
      clearTimeout(this.intervalSearch);
    }
    this.intervalSearch = setTimeout(this.sendRequestSearch,500,this.router,e.target.value);
  }
  /**
   * @description     Metodo para colocar en el foco el campo de busqueda.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           30-10-2019
   */
  focusSearch(){
    this.searchActiveMobile=!this.searchActiveMobile;
    let inputSearch;
    if(this.responsive == 'desktop'){
      inputSearch = document.querySelector('#buscador');
    }else if(this.responsive == 'tab'){
      inputSearch = document.querySelector('#buscador-tablet');
    }else{
      inputSearch = document.querySelector('#buscador-mobile');
    }
    inputSearch.focus();
  }
  /**
   * @description     Metodo para hacer consultar desde la barra de busqueda.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           30-10-2019
   */
  sendRequestSearch(router,search){
    router.navigate(['/clasificados'],{queryParams:{p_descripcion:search}});
  }
  /**
   * @description     Metodo para LIMPIAR BARRA DE BUSQUEDA.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           30-10-2019
   */
  clearSearch(){
    let inputSearch;
    if(this.responsive == 'desktop'){
      inputSearch = document.querySelector('#buscador');
    }else if(this.responsive == 'tab'){
      inputSearch = document.querySelector('#buscador-tablet');
    }else{
      inputSearch = document.querySelector('#buscador-mobile');
    }
    inputSearch.value = "";
  }

  openRecomendador(){
    var dialogRef = this.dialog.open(RecomendadorDialog,{
      data:{}
    })
    
    dialogRef.disableClose = true;
    // LOADING
    // dialogRef.componentInstance.loading.subscribe(val=>{
    //   this.loading = val;
    // })
    // RETORNA RESULTADOS DE REGISTRO
    // dialogRef.componentInstance.updateLoggedStatus.subscribe(val=>{
    //   this.loading = false;
    //   this.isLogged = false;
    //   if(typeof(val)=='object'){
    //     if(val.name != '' && val.name != undefined){
    //       this.avatar = val.p_clienteimagen;
    //       this.isLogged   = true;
    //       this.user       = val.name;
    //       this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    //       let cuser;
    //       cuser = this.cuser;
    //       this.AuthenticationService.setToken(cuser.token);
    //       dialogRef.close();
    //       swal.fire({
    //         title: '<strong>Bienvenido a Indicar</strong>',
    //         icon: null,
    //         html:
    //           'Si deseas conocer como hacer tu primera publicación consulta '+
    //           '<a href="https://cdnprocessoft.s3.amazonaws.com/SITIOS/XuQlxMLqjS_vGRUP1rcXyNlDKh3dwzcsokrQU-C0s2w/indicar/INSTRUCTIVO-PUBLICAR-CLASIFICADOS-EN-INDICAR-PERSONA-NATURAL.pdf" target="_blank">aquí</a>',
    //         showCloseButton: true,
    //         confirmButtonText:'<i class="fa fa-thumbs-up"></i> Ok!'
    //       })
    //     }
    //   }else{
    //     console.log(val);
    //   }
    // })
  }

  /*  ############################################## GENERICO  ##############################################*/
  /**
   * @description     Metodo para calcular el ancho de la pagina cuando se redimensiona.
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           30-10-2019
   * @param           event      evento de redimensionamiento de pantalla.
   */
  onResize(event){
    let width = event.target.innerWidth;
    this.isResponsive(width);
  }
  /**
   * @author          Daniel Bolivar - debb94 github
   * @version         1.0.0
   * @since           30-10-2019
   * @param           width      ancho de la pantalla.
   * @description     Metodo usado para determinar si la aplicacion es responsiva. modifica la variable responsive.
   */
  isResponsive(width=null){
    if(width == null){
      width = window.innerWidth;
    }
    this.responsive= 'desktop';

    if(width <= 768){
      this.responsive = 'mobile';
    }else if(width > 768 && width < 1200){
      this.responsive = 'tab';
    }else{
      this.responsive = 'desktop';
    }
  }
}