import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CuentaDialog } from './../../dialogs/cuenta/cuenta.dialog.component';
import swal from 'sweetalert2';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { AuthenticationService } from 'src/app/servicios/authentication-service.service';
import { Router } from '@angular/router';
import { EncabezadoComponent } from 'src/app/components/encabezado.component';

// interface
export interface lovCiudades{
  ciudad_codigo:number,
  ciudad_nombre:string
}

@Component({
  selector: 'app-usuario-cuenta',
  templateUrl: './usuario-cuenta.component.html',
  styleUrls: ['./usuario-cuenta.component.css']
})
export class UsuarioCuentaComponent implements OnInit {
  public loading = false;
  // variables
  cuser;
  textDato:string         = "";
  usuario:any             = [];
  tipoDocumentos:any      = [];
  ciudades:any            = [];
  ciudadesEmpresa:any     = [];
  dataPhone:any           = [];
  logo:any                = [];

  // data table
  displayedColumnsPhone   = [];
  dataAsesor:any  	      = [];
  displayedColumnsAsesor  = [];

  dataPhoneRespaldo; // contiene la informacion de los telefonos del usuario usado para filtrar tablas.
  // dataAsesorRespaldo; // contiene la informacion de los asesores del usuario usado para filtrar tablas.

  registerPhone:number    = 1;
  registerAsesor:number   = 1;

  // mask
  public maskPhone = "(000) 000 0000";
  public maskDate = "00/00/0000";

  // formularios
  formUsuario:any;
  formUsuarioJuridico:any;


  isLoadingResults = true; //loading tables

  panelOpenState;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  // @ViewChild(MatPaginator, {static: false}) paginatorPhone: MatPaginator;
  // @ViewChild(MatSort, {static: false}) sortPhone: MatSort;

  // @ViewChild(MatPaginator, {static: false}) paginatorAsesor: MatPaginator;
  // @ViewChild(MatSort, {static: false}) sortAsesor: MatSort;

  constructor(
    private WebApiService:WebApiService,
    private dialog:MatDialog,
    public snackBar: MatSnackBar,
    public AuthenticationService:AuthenticationService,
    public router:Router,
    public encabezado:EncabezadoComponent
  ){ 
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    this.textDato = (this.cuser.tipocliente == '02') ? 'Datos de la empresa' : 'Datos personales';
  }

  ngOnInit(){
    this.initForms();
    this.sendRequest();
    window.scrollTo(0,0);
    window.scroll(0,0);
  }

  sendRequest(){
    // REDUCIR LAS CONSULTAS AL SERVER
    // TIPO DE DOCUMENTOS.
    this.WebApiService.getRequest(AppComponent.urlService,
      {
        _p_action:'_getLovs',
        p_lov: '_LOVTABLALISTA',
        p_tabla: 'ICTIPODOCUMENTO'
    }).subscribe(
      data =>{
        this.tipoDocumentos = data.datos;
      },
      error=>{
        console.log(error);
      }
    );
    // TELEFONOS DE CLIENTE
    this.WebApiService.getRequest(AppComponent.urlService,
      {
        _p_action:'_getLovs',
        p_lov: '_LOVTELEFONOCLIENTE'
    }).subscribe(
      data =>{
        let datos;
        datos = data.datos;

        this.dataPhone = [];
        this.dataPhoneRespaldo = [];
        datos.forEach(element => {
          this.dataPhone.push({
            select:false,
            codigo:element.campo_codigointerno,
            numero:element.campo_descripcion
          })
        });
        this.dataPhoneRespaldo = this.dataPhone;
        this.registerPhone = datos.length;
        this.generaTablePhone(this.dataPhone);
      },
      error=>{
        console.log(error);
      }
    );
    // ASESORES DE CLIENTE
    if(this.cuser.tipocliente == '02'){
      this.WebApiService.getRequest(AppComponent.urlService,
        {
          _p_action:'_getLovs',
          p_lov: '_LOVASESORCLIENTE2'
      }).subscribe(
        data =>{
          let datos;
          datos                     = data.datos;
          this.dataAsesor           = [];
          // this.dataAsesorRespaldo   = [];
          let aux                   = 0;
          if(!Array.isArray(datos[0])){
            datos.forEach(element=>{
              this.dataAsesor.push({
                select: false,
                codigo: element.campo_codigointerno,
                asesor: element.campo_descripcion
              });
              aux++;
            });
          }
          // this.dataAsesorRespaldo = this.dataAsesor;
          this.registerAsesor = aux;
          this.generaTableAsesor(this.dataAsesor);
        },
        error=>{
          console.log(error);
        }
      );
    }
    // CIUDADES - UBICACION 
    this.WebApiService.getRequest(AppComponent.urlService,
      {
        _p_action: '_getLovs',
        p_lov: '_LOVCIUDADES'
      }
    ).subscribe(
      data =>{
        this.ciudades                = data.datos;
        this.ciudadesEmpresa         = data.datos;
      },
      error=>{
        console.log(error);
      }
    );

    // INFORMACION DE CUENTA
    this.WebApiService.getRequest(AppComponent.urlService,
      {
        _p_action:'_getCuentaConfigurar',
    }).subscribe(
      data =>{
        this.usuario = data.datos[0];
        // completo informacion del formulario
        if(this.cuser.tipocliente == '01'){ // natural
          this.formUsuario.get('fnombres').setValue(this.usuario.cliente_nombre1+' '+this.usuario.cliente_nombre2);
          this.formUsuario.get('fapellidos').setValue(this.usuario.cliente_apellido1+' '+this.usuario.cliente_apellido2);
          this.formUsuario.get('ftipodocumento').setValue(this.usuario.cliente_tipodocumento);
          this.formUsuario.get('fnumerodocumento').setValue(this.usuario.cliente_numerodocumento);
          this.formUsuario.get('ffechanacimiento').setValue(this.usuario.cliente_cumpleano);
          this.formUsuario.get('ftelefono').setValue(this.usuario.cliente_telefonocelular);
        }else{ // juridico
          let logo = JSON.parse(this.usuario.foto_imagen);
          this.logo = [{
            name:  logo.filename,
            src:   logo.url
          }];
          this.formUsuarioJuridico.get('frazonsocial').setValue(this.usuario.cliente_razonsocial);
          this.formUsuarioJuridico.get('fnit').setValue(this.usuario.cliente_numerodocumento);
          this.formUsuarioJuridico.get('fubicacion').setValue({ciudad_codigo:this.usuario.cliente_ciudad,ciudad_nombre:this.usuario.ciudad_nombre});
          this.formUsuarioJuridico.get('fdireccion').setValue(this.usuario.cliente_direccion);
          this.formUsuarioJuridico.get('fwebsite').setValue(this.usuario.cliente_url);          
        }
      },
      error=>{
        console.log(error);
      }
    );
  }



  // ############################################### GESTION DE USUARIO ###############################################
  // GESTION DE IMAGEN DEL LOGO Y USUARIO
  openFolder(){
    let inputLogo;
    inputLogo = document.querySelector('#logoInput');
    inputLogo.click();
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para maneja la imagen seleccionada por el usuaio.
   * @version     1.0.0
   * @since       31-01-2020
   * @param       images imagen cargada en input type file.
   */
  handleFile(e){
    let images = e.target.files;
    if(images.length > 0){
      this.processImages(images);
    }
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para procesar las imagenes una vez son cargadas.
   * @version     1.0.0
   * @since       31-01-2020
   * @param       images imagen cargada en input type file.
   */
  processImages(images){
    this.loading = true;
    let image = images[0];
    this.preProcesado(image)
    .then(img=>{
      return this.cutImage(img);
    })
    .then(result=>{
      this.logo = result;
      this.loading = false;
    })
    .catch(error=>{
      console.log(error);
      this.loading = false;
    });
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para crear imagen a partir de input.
   * @version     1.0.0
   * @since       31-01-2020
   * @param       images imagen cargada en input type file.
   */
  preProcesado(image){
    return new Promise((resolve,reject)=>{
      // nombre de fichero
      let name = image.name.split('.');
      let file = name[0];
      let filename = file+'.jpg';
      //  procesando la imagen
      let pic;
      let fr;
      pic = new Image();
      fr  = new FileReader();
      fr.onload = function(){
        pic.src = fr.result;
      }
      fr.readAsDataURL(image);
      pic.onload = function(){
        resolve({
          name: filename,
          pic
        })
      }
    });
  }
  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para cortar las imagenes a procesar.
   * @version     1.0.0
   * @since       31-01-2020
   * @param       image imagen preprocesada.
   */
  cutImage(image){
    return new Promise((resolve,reject)=>{
      // datos
      let filename = image.name;
      let pic = image.pic;
      // seccion del canvas
      let ca;
      let bo;
      if(document.contains(document.getElementById('canvasImage'))){
        ca = document.getElementById('canvasImage');
      }else{
        ca = document.createElement('canvas');
        ca.id = 'canvasImage';
        ca.classList.add('noview');
        bo = document.getElementsByTagName('body')[0];
        bo.appendChild(ca);
      }

      // recorte de imagen
      let ctx = ca.getContext("2d");
      let w,h, tm,r,nw,nh,src,objImage,prev;
      w = pic.width;
      h = pic.height;
      // dimensiones
      if(w >= 250){
        // tamaño mayor a 400px reduzco el tamaño a 400px
        tm = 250;
      }else if( w >= 200 && w < 250){  
        // tamaño mayor a 1200px y menor o igual a 2000px
        tm = 200;
      }else{
        // tamaño original
        tm = w;
      }
      // nuevas dimensiones
      r = (tm/w);
      nw = r*w;
      nh = r*h;
      ctx.canvas.width = nw;
      ctx.canvas.height = nh;
      // dibujando
      ctx.drawImage(pic,0,0,nw,nh);
      src = ctx.canvas.toDataURL('image/jpeg',0.8);
      let dataLogo = [];
      dataLogo.push({
        name:  filename,
        src:   src
      });
      resolve(dataLogo);
    });
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para remover imagenes cargadas en el campo de logo.
   * @version     1.0.0
   * @since       31-01-2020
   */
  removeLogo(){
    let inputLogo;
    inputLogo = document.querySelector('#logoInput');
    inputLogo.value = "";
    this.logo = [];
  }



  // ############################################### /GESTION DE USUARIO ###############################################

  // ############################################### GESTION DE TABLAS TELEFONO Y ASESORES ###############################################
  generaTablePhone(data){
    this.displayedColumnsPhone = ['select','codigo', 'numero','accion'];
    this.dataPhone = new MatTableDataSource(data);
    // this.dataPhone.paginator  = this.paginatorPhone;
    // this.dataPhone.sort       = this.sortPhone;  
    this.dataPhone.sort       = this.sort.toArray()[0];
    this.dataPhone.paginator = this.paginator.toArray()[0];
  }
  generaTableAsesor(data){
    this.displayedColumnsAsesor =['select','codigo','asesor','accion'];
    this.dataAsesor = new MatTableDataSource(data);
    this.dataAsesor.paginator = this.paginator.toArray()[1];
    this.dataAsesor.sort      = this.sort.toArray()[1];
  }

  applyFilterPhone(filterValue: string) {
    this.dataPhone.filter = filterValue.trim().toLowerCase();
  }
  applyFilterAsesor(filterValue: string) {
    this.dataAsesor.filter = filterValue.trim().toLowerCase();
  }

  // ACCIONES EN SELECCION
  detailSelected(opt,table){
    let data;
    if(table == 'phone'){
      data = this.dataPhone.data;
    }else if(table == 'asesor'){
      data = this.dataAsesor.data;
    }
    
    let operacionMsg='';
    switch (opt) {
      case "ELIMINAR": {
        operacionMsg='Eliminar';
        break;
      }
    } 
    let cantidad = 0; 
    let msgEnd = (table == 'asesor')? "asesor":"teléfono";   //  [asesor|telefono]
    let handlerData = [];
    for (let o of data) {
      if(o.select){
        cantidad++;
        if(table == "asesor"){
          msgEnd = "asesor";
        }else{
          msgEnd = "teléfono";
        }
        if(cantidad > 1){
          if(table == "asesor"){
            msgEnd = "asesores";
          }else{
            msgEnd = "teléfonos";
          }
        }
        handlerData.push(o);
      }
    }
    if(cantidad<1){
      swal.fire({
        title:'',
        text:'Debes seleccionar al menos un '+msgEnd,
        icon: null
      });
    }else if(table == "phone" && cantidad == data.length ){
      swal.fire({
        title:'',
        text:'Debes dejar al menos un teléfono para contactarte',
        icon: null
      });
    }else{
      swal.fire({
        title:  "",
        text:   "¿"+operacionMsg+" "+msgEnd+"?",
        icon:   null,
        showCloseButton:   true,
        showCancelButton:  true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continuar',
        cancelButtonText:  'Cancelar'
      }).then((result) => {
        if (result.value) {
          for (let o of handlerData) { 
            switch (opt) {
              case "ELIMINAR": {             
                if(o.select){
                  this.deleteData(o.codigo,table);
                }
                break;
              }
            }       
          }
          // this.sendRequest();
        }
      });
    }
  }
  // BORRADO MULTIPLE
  deleteData(cod,table){
    let param;
    let body;
    if(table == "asesor"){
      param = '_clienteasesor';
        body = {
          "asesor_codigo":cod
        }
    }else if(table == 'phone'){
        param = '_clientetelefono';
        body = {
          "telefono_codigo":cod
        }
    }

    this.WebApiService.deleteRequest(AppComponent.urlService,body,{
      _p_action: param
    })
    .subscribe(
      data =>{
        this.snackBar.open('Información actualizada', null, {
          duration: 3000
        });                                 
        this.sendRequest();  
      },
      error=>{
        this.snackBar.open('Ocurrio un error', null, {
          duration: 3000
        });  
        console.log(error);
      }
    )
  }

  // BORRAR LINEA
  deleteRow(type:string,cod:string,desc:string = null){
    let msg = type;
    if(type == 'phone'){
      msg = "teléfono "+desc;
    }
    swal.fire({
      text: '¿Eliminar '+msg+'?',
      icon: null,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        let body;   // datos enviados a elimina
        let param;  // parametro de url 
        switch(type){
          case "asesor":
            body = {
              "asesor_codigo": cod
            }
            param = '_clienteasesor';
          break;
          case "phone":
            body = {
              "telefono_codigo": cod
            }
            param = "_clientetelefono";

            if(this.dataPhone.data.length == 1){  // notificamos si solo existe un numero telefonico.
              this.loading = false;
              swal.fire({
                text: 'Debes dejar al menos un teléfono para contactarte',
                icon: null,
                title:""
              });
              return;
            }
          break;
        }
        this.WebApiService.deleteRequest(AppComponent.urlService,body,{
          _p_action: param
        })
        .subscribe(
          data=>{
            // console.log(data);
            this.snackBar.open('Información actualizada', null, {
              duration: 3000
            });                                 
            this.sendRequest();
            this.loading = false;
          },
          error=>{
            console.log(error);
            this.snackBar.open('Error al actualizar', null, {
              duration: 3000
            });
            this.loading = false;
          }
        );
      }
    });
    return false; 
  }

  // ######################### /GESTION DE TABLAS TELEFONO Y ASESORES ###############################################

  openDialog(dialog,cod:string = null, desc:string = null){
    var dialogRef;
    if(dialog == 'correo'){
      dialogRef = this.dialog.open(CuentaDialog,{
          data: {
            dialog: 'correo'
          }
        }
      );
    }else if(dialog == 'contraseña'){
      dialogRef = this.dialog.open(CuentaDialog,{
          data: {
            dialog: 'contraseña'
          }
        }
      );
    }else if(dialog == 'phone'){
      dialogRef = this.dialog.open(CuentaDialog,{
          data: {
            dialog: 'phone',
            telefono_codigo:cod,                    
            telefono_numero:desc
          }
        }
      );
    }else if(dialog == 'asesor'){
      dialogRef = this.dialog.open(CuentaDialog,{
          data: {
            dialog: 'asesor',
            asesor_codigo: cod,
            asesor_nombre: desc
          }
        }
      );
    }
    // evitar cierre con click
    dialogRef.closeDialog = true;
    // LOADING
    dialogRef.componentInstance.loading.subscribe(val=>{
      this.loading = val;
    })
    // CERRAR DIALOGO
    dialogRef.componentInstance.closeDialog.subscribe(val=>{
      this.loading = false;
      this.sendRequest();
      dialogRef.close();
    })
  }
  
  filterOptions(e){
    let write = e.target.value;
    this.ciudadesEmpresa = this.ciudades.filter(item =>{
      return item.ciudad_nombre.search(write.toUpperCase()) != -1;
    });
  }

  displayFn(ciudad?: lovCiudades): string | undefined {
    return ciudad ? ciudad.ciudad_nombre : undefined;
  }

  initForms(){
    if(this.cuser.tipocliente == '01'){
      this.formUsuario = new FormGroup({
        fnombres: new FormControl('',[Validators.required, Validators.maxLength(100)]),
        fapellidos:new FormControl('',[Validators.required, Validators.maxLength(100)]),
        ftipodocumento: new FormControl(''),
        fnumerodocumento: new FormControl('',[Validators.pattern('[0-9]*')]),
        ffechanacimiento: new FormControl(''),
        ftelefono: new FormControl('')
      });
    }else{
      this.formUsuarioJuridico = new FormGroup({
        frazonsocial: new FormControl('',[Validators.required, Validators.maxLength(100)]),
        fnit:new FormControl('',[Validators.required, Validators.maxLength(100), Validators.pattern('[0-9]*')]),
        fubicacion: new FormControl(''),
        fdireccion: new FormControl(''),
        fwebsite: new FormControl('',[Validators.pattern('(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?')])
      });
    }
  }
  // ############################################## FORMULARIOS DE CONFIGURACION DE CUENTA ##############################################
  onSubmit(){
    event.preventDefault();
    if(!this.formUsuario.valid){
      swal.fire({
        title:'',
        text:'Complete correctamente la información solicitada.',
        icon: null
      });
    }else{
      //nombres
      let fname = this.formUsuario.get('fnombres').value.trim().split(' ')[0];
      fname     = fname.slice(0,1).toUpperCase()+fname.slice(1).toLowerCase();
      let sname = "";
      sname     = this.formUsuario.get('fnombres').value.split(' ')[1];
      // apellidos
      let flname  = this.formUsuario.get('fapellidos').value.trim().split(' ')[0];
      flname  = flname.slice(0,1).toUpperCase()+flname.slice(1).toLowerCase();
      let slname  = "";
      slname  = this.formUsuario.get('fapellidos').value.split(' ')[1];
      let fnacimiento = this.formUsuario.get('ffechanacimiento').value;
      if(fnacimiento!=""){
        if(fnacimiento > 10){
          fnacimiento = fnacimiento.toJSON().slice(0,10);
        }
      }else{
        fnacimiento = null;
      }
      let data  = {
        nombre1:          fname,
        nombre2:          sname,
        apellido1:        flname,
        apellido2:        slname,
        tipocliente:      this.cuser.tipocliente,
        tipodocumento:    this.formUsuario.get('ftipodocumento').value,
        numerodocumento:  this.formUsuario.get('fnumerodocumento').value,
        fnacimiento:      fnacimiento,
        telefono:         this.formUsuario.get('ftelefono').value.replace(/\D+/g, '')
      };
      let body = {
        formulario :  data
      }
      this.WebApiService.putRequest(AppComponent.urlService,body,{
        _p_action:'_putCuentaConfigurar'
      })
      .subscribe(
        data=>{
          if(data.success){
            this.snackBar.open('Información actualizada', 'Aceptar', {
              duration: 3000
            });
            this.encabezado.user = this.formUsuario.get('fnombres').value;
          }
          window.scrollTo(0,0);
        },
        error=>{
          this.snackBar.open('Error al actualizar', 'Aceptar', {
            duration: 3000
          });
          window.scrollTo(0,0);
        }
      );
    }
  }

  validateUbicacion(){
    if(typeof(this.formUsuarioJuridico.get('fubicacion').value) != "object"){
      this.formUsuarioJuridico.get('fubicacion').setValue('');
    }
  }

  onSubmitJuridico(){
    event.preventDefault();
    let form;
    form = this.formUsuarioJuridico.value;
    //console.log(form);
    if(form.cliente_direccion != ""){
      if(form.fubicacion == "" || form.fubicacion.ciudad_codigo == null ){
        swal.fire({
          title: "",
          text: "Para asociar una dirección es necesario definir donde esta ubicada la empresa.",
          icon: null
        });
        return false;
      }
    }
    if(!this.formUsuarioJuridico.valid){
      swal.fire({
        title:'',
        text:'Campos incorrectos.',
        icon: null
      });
    }else{
      let data  = {
        razonsocial:      this.formUsuarioJuridico.get('frazonsocial').value,
        numerodocumento:  this.formUsuarioJuridico.get('fnit').value,
        tipocliente:      this.cuser.tipocliente,
        ubicacion_empresa:this.formUsuarioJuridico.get('fubicacion').value,
        cliente_direccion:this.formUsuarioJuridico.get('fdireccion').value,
        cliente_url:      this.formUsuarioJuridico.get('fwebsite').value
      };
      let body = {
        formulario : data,
        imagen:       this.logo
      }
      // console.log(body);
      this.WebApiService.putRequest(AppComponent.urlService,body,{
        _p_action:'_putCuentaConfigurar'
      })
      .subscribe(
        data=>{
          if(data.success){
            this.snackBar.open('Información actualizada', 'Aceptar', {
              duration: 3000
            });
            this.encabezado.user = this.formUsuarioJuridico.get('frazonsocial').value;
          }
          window.scrollTo(0,0);
        },
        error=>{
          this.snackBar.open('Error al actualizar', 'Aceptar', {
            duration: 3000
          });
          window.scrollTo(0,0);
        }
      );
    }
  }

  inactivatedAccount(){
    swal.fire({
        text: "¿Desea inactivar tu cuenta de usuario?",
        icon: null,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          let body = {};
          this.WebApiService.putRequest(AppComponent.urlService,body,{
            _p_action:'_cuentaconfigurar',
            p_operacion:'inactivarcuenta'
          })
          .subscribe(
            data=>{
              this.encabezado.isLogged = false;
              this.AuthenticationService.logout();
              this.router.navigate(['/']);
            },
            error=>{
              console.log(error);
            }
          )
        }
      })
    return false; 
  }
  // ############################################## /FORMULARIOS DE CONFIGURACION DE CUENTA ##############################################
}