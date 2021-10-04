import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";
import { WebApiService } from "src/app/servicios/web-api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MatStepper } from "@angular/material";
import { MatSnackBar } from "@angular/material/snack-bar";
import swal from "sweetalert2";

import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { reject } from "q";
import { ActivatedRoute, Router } from "@angular/router";
import { EncryptService } from "src/app/servicios/encrypt.service";
import { ChangeEvent, CKEditorComponent } from "@ckeditor/ckeditor5-angular";

declare var EXIF: any;
declare var gtag;
// interface
export interface lovCiudades {
  ciudad_codigo: number;
  ciudad_nombre: string;
}

@Component({
  selector: "app-usados-publicar",
  templateUrl: "./usados-publicar.component.html",
  styleUrls: ["./usados-publicar.component.css"],
})
export class UsadosPublicarComponent implements OnInit, AfterViewInit {
  // VARIABLES
  public maskphone = "(000) 000 0000";
  public maskplaca = "SSS 000";
  public loading = false;
  public Editor = ClassicEditor; // editor
  // public Editor           = new ClassicEditor(); // editor
  codigo_venta: string = null; // indica el codigo del clasificado que se desea editar.
  clases: any = [];
  accesorios: any = [];
  ciudades: any = [];
  ciudadesMatricula: any = [];
  ciudadesUbicacion: any = [];
  asesores: any = [];
  telefonos: any = [];
  cuser: any = "";
  fotos = [];
  step = 1;
  headerSteps: any = [];
  accesoriosSelected = [];
  viewAsesores: boolean = false;
  editedForm: boolean = false; // indica si el formulario fue editado.
  modifiedPhotos: boolean = false; // indica que las fotos del clasificado fueron modificadas.
  p_consecutivo: string = null; // indica el clasificado o publicacion que estoy editando.
  p_filtros: any = {}; // filtros de busqueda para consulta inicial y consultar cambios en formularios.
  isConcesionario: boolean = false;
  comentarios: string = "";
  publicar: boolean = false;
  cambio: boolean = false;
  // mask

  //selectores
  clase;
  marcas;
  modelo;
  familia;
  caja;
  linea;

  // secciones
  previewPrincipal: any = null;
  inputUpload: any = null; // input de carga de foto principal
  inputUploads: any = null; // input de carga de fotos otras
  secUploadFile: any = null; // seccion de foto principal
  secUploadFiles: any = null; // seccion de fotos otras

  // FORMULARIOS
  formVehiculo: FormGroup;
  formDetalle: FormGroup;
  formEquipamiento: FormGroup;
  formPrecio: FormGroup;

  // mat - step
  @ViewChild("stepper", { read: null, static: false })
  private myStepper: MatStepper;
  // editor
  @ViewChild("editorComentario", { read: null, static: false })
  editorComentario: CKEditorComponent;

  drop(event: CdkDragDrop<string[]>) {
    // console.log( event.previousIndex);
    // console.log(event.currentIndex);
    moveItemInArray(this.fotos, event.previousIndex, event.currentIndex);

    this.modifyPictures();
  }

  constructor(
    private WebApiService: WebApiService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private encrypt: EncryptService,
    public snackBar: MatSnackBar
  ) {
    this.cuser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.cuser.tipocliente == "02") {
      this.isConcesionario = true;
    }
  }

  ngOnInit() {
    this.initForms();
    // console.log('inicio');
    // console.log(this.cuser.codigo);
    this.route.paramMap.subscribe((params) => {
      if (params.get("id") != null) {
        this.codigo_venta = this.encrypt.desencrypt(params.get("id"));

        this.sendRequest();
      } else {
        this.checkPostsInProcess(this.cuser.codigo);
      }
    });
    window.scrollTo(0, 0);
    // comprobar si tengo clasificado en proceso. y preguntar si lo quiere continuar.
    // Aplicar autoguardado.
    // this.sendRequest();
  }

  ngAfterViewInit() {
    this.initUploadBold();
    this.headerSteps = document.querySelectorAll("mat-step-header");

    this.headerSteps.forEach((item, index) => {
      if (index > 0) {
        item.classList.add("noview");
      }
    });
    window.scrollTo(0, 0);
  }

  /**
   * @description   Metodo usado obtener registros principales de la DB.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         09-12-2019
   */
  sendRequest() {
    if (this.codigo_venta != null) {
      this.getRecord();
    } else {
      this.WebApiService.getRequest(AppComponent.urlService, {
        _p_action: "_getGeneral",
        p_tabla: "primary_data",
      }).subscribe(
        (dataPrimary) => {
          let resp;
          resp = dataPrimary.datos;
          // CLASES
          let dataClases = JSON.parse(resp[0].clases);
          let clases = Array();
          for (let i in dataClases) {
            clases.push({
              campo_codigo: i,
              campo_descripcion: dataClases[i],
            });
          }
          this.clases = clases;

          // CIUDADES
          let dataCiudades = JSON.parse(resp[0].ciudades);
          if (dataCiudades != null && dataCiudades != "") {
            let ciudades = Array();
            for (let i in dataCiudades) {
              if (dataCiudades[i].toLowerCase() != "todas") {
                ciudades.push({
                  ciudad_codigo: i,
                  ciudad_nombre: dataCiudades[i],
                });
              }
            }
            this.ciudades = ciudades;
          }

          // TELEFONOS
          let dataTelefonos = JSON.parse(resp[0].telefonos);
          let telefonos = Array();
          for (let i in dataTelefonos) {
            telefonos.push({
              campo_codigo: i,
              campo_descripcion: dataTelefonos[i],
            });
          }
          this.telefonos = telefonos;

          // ASESORES
          let dataAsesores = JSON.parse(resp[0].asesores);
          let asesores = Array();
          for (let i in dataAsesores) {
            asesores.push({
              campo_codigo: i,
              campo_descripcion: dataAsesores[i],
            });
          }
          this.asesores = asesores;

          // ACCESORIOS
          let dataAccesorios = JSON.parse(resp[0].accesorios);
          this.accesorios = Array();
          for (let i in dataAccesorios) {
            this.accesorios.push({
              accref_codigo: i.toString(),
              accref_nombre:
                dataAccesorios[i].trim().slice(0, 1).toUpperCase() +
                dataAccesorios[i].trim().slice(1).toLowerCase(),
            });
          }
          window.scrollTo(0, 0);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           08-01-2020
   * @param           codCliente codigo de cliente
   * @description     Metodo usado para alertar al usuario si tiene un clasificado pendiente y desea continuarlo.
   */
  checkPostsInProcess(codCliente: number) {
    this.loading = true;
    this.WebApiService.getRequest(AppComponent.urlService, {
      _p_action: "_publicar",
      p_cliente: codCliente,
      p_check: true,
    }).subscribe(
      (data) => {
        let datos;
        datos = data.datos[0];
        if (data.success == true && data.result > 0) {
          let dataSwal = {};
          dataSwal["title"] = "";
          dataSwal["icon"] = null;
          dataSwal["showCloseButton"] = true;
          dataSwal["showCancelButton"] = true;
          dataSwal["confirmButtonColor"] = "#3085d6";
          dataSwal["cancelButtonColor"] = "#d33";
          dataSwal["confirmButtonText"] = "Continuar";
          dataSwal["cancelButtonText"] = "Descartar";
          dataSwal["text"] =
            "Existe una publicación que aún no has terminado. ¿Deseas continuar donde la dejaste?";
          if (datos.hasOwnProperty("ft_fotosventa_ruta")) {
            let pic = JSON.parse(datos.ft_fotosventa_ruta);
            dataSwal["imageUrl"] = pic[0].url;
          }
          swal.fire(dataSwal).then((resp) => {
            if (resp.value == true) {
              // deseo continuar con el clasificado anterior.
              this.setFormFromData(datos);
            } else {
              // descartar y comenzar un nuevo clasificado.
              // eliminar el clasificado en la tabla temp.
              let body = {
                cliente_codigo: codCliente,
              };
              this.WebApiService.deleteRequest(AppComponent.urlService, body, {
                _p_action: "_publicar",
              }).subscribe(
                (data) => {
                  this.snackBar.open("Descartado con éxito...", null, {
                    duration: 3000,
                  });
                },
                (error) => {
                  console.log(error);
                  this.snackBar.open("Error al actualizar", null, {
                    duration: 3000,
                  });
                }
              );
              this.sendRequest();
            }
          });
          this.loading = false;
        } else {
          // eliminar fotos
          this.sendRequest();
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           08-01-2020
   * @param           datos data obtenida desde el servidor sobre el vehiculo que se esta editando o publicando.
   * @description     Metodo usado para asignar a los formularios de publicacion de usados los valores correspondiente a partir de la informacion obtenida desde la base de dato
   */
  setFormFromData(datos: any) {
    this.WebApiService.getRequest(AppComponent.urlService, {
      _p_action: "_getGeneral",
      p_tabla: "primary_data",
    }).subscribe(
      (dataPrimary) => {
        let resp;
        resp = dataPrimary.datos;

        // ASIGNACION DE CLASES PRIMARIAS
        let dataClases = JSON.parse(resp[0].clases);
        let clases = Array();
        for (let i in dataClases) {
          clases.push({
            campo_codigo: i,
            campo_descripcion: dataClases[i],
          });
        }
        this.clases = clases;
        this.formVehiculo.get("fclase").setValue(datos.clase_codigo);

        // ASIGNACION DE CIUDADES
        let dataCiudades = JSON.parse(resp[0].ciudades);
        if (dataCiudades != null && dataCiudades != "") {
          let ciudades = Array();
          for (let i in dataCiudades) {
            if (dataCiudades[i].toLowerCase() != "todas") {
              ciudades.push({
                ciudad_codigo: i,
                ciudad_nombre: dataCiudades[i],
              });
            }
          }
          this.ciudades = ciudades;
          this.ciudadesMatricula = ciudades;
        }

        // ASIGNACION DE TELEFONO
        let dataTelefonos = JSON.parse(resp[0].telefonos);
        if (dataTelefonos != "" && dataTelefonos != null) {
          let telefonos = Array();
          for (let i in dataTelefonos) {
            telefonos.push({
              campo_codigo: i,
              campo_descripcion: dataTelefonos[i],
            });
          }
          this.telefonos = telefonos;
          this.formDetalle
            .get("fnumeroprincipal")
            .setValue(datos.venta_telefonocontacto1);
        }

        // ASIGNACION DE ASESORES
        let dataAsesores = JSON.parse(resp[0].asesores);
        if (dataAsesores != "" && dataAsesores != null) {
          let asesores = Array();
          for (let i in dataAsesores) {
            asesores.push({
              campo_codigo: i,
              campo_descripcion: dataAsesores[i],
            });
          }
          this.asesores = asesores;
          this.formDetalle.get("fasesor").setValue(datos.venta_nombreasesor);
          this.formDetalle.get("fasesor2").setValue(datos.venta_nombreasesor2);
        }

        // ASIGNACION DE ACCESORIOS
        let dataAccesorios = JSON.parse(resp[0].accesorios); // datos originales de base de dato
        let selected = JSON.parse(datos.accref_codigo); //datos del clasificado
        if (selected != "" && selected != null) {
          this.accesoriosSelected = Array();
          selected.forEach((item) => {
            this.accesoriosSelected.push(item.toString());
          });
          this.accesorios = Array();
          for (let i in dataAccesorios) {
            this.accesorios.push({
              accref_codigo: i.toString(),
              accref_nombre:
                dataAccesorios[i].trim().slice(0, 1).toUpperCase() +
                dataAccesorios[i].trim().slice(1).toLowerCase(),
            });
          }
          this.formEquipamiento
            .get("faccesorios")
            .setValue(this.accesoriosSelected);
        } else {
          this.accesorios = Array();
          for (let i in dataAccesorios) {
            this.accesorios.push({
              accref_codigo: i.toString(),
              accref_nombre:
                dataAccesorios[i].trim().slice(0, 1).toUpperCase() +
                dataAccesorios[i].trim().slice(1).toLowerCase(),
            });
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );

    // DETALLE
    this.formDetalle.get("fubicacion").setValue({
      ciudad_codigo: datos.cc_ciudad_codigo,
      ciudad_nombre: datos.cc_ciudad_nombre,
    });
    this.formDetalle.get("fciudadmatricula").setValue({
      ciudad_codigo: datos.cm_ciudad_codigo,
      ciudad_nombre: datos.cm_ciudad_nombre,
    });
    this.formDetalle.get("fplaca").setValue(datos.venta_matricula_placa);
    this.formDetalle.get("fkilometraje").setValue(datos.venta_kilometraje);
    this.formDetalle
      .get("fnumeroadicional")
      .setValue(datos.venta_telefonocontacto3);
    this.formDetalle.get("funicoduenio").setValue(datos.venta_unicopropietario);
    // this.formDetalle.get('fcomentarios').setValue(datos.venta_descripcion);
    // this.comentarios = datos.venta_descripcion;
    let editor = this.getEditor();
    editor.setData(datos.venta_descripcion);
    this.comentarios = datos.venta_descripcion;
    // console.log(this.comentarios);
    // this.Editor.setData('<p>asdasdsa</p>');
    // vehiculoComentarios = document.getElementById('description-vehiculo');
    // vehiculoComentarios.querySelector('.ck.ck-content.ck-editor__editable').innerHTML = '<p>'+datos.venta_descripcion+'</p>';
    // vehiculoComentarios.setAttribute('data',datos.venta_descripcion);
    // IMAGENES
    this.fotos = Array();

    if (datos.fp_fotosventa_ruta != undefined) {
      let picture_principal = JSON.parse(datos.fp_fotosventa_ruta);

      this.fotos.push({
        filename: picture_principal[0].filename,
        src: picture_principal[0].url,
      });

      this.activeOptions();
    }
    if (datos.fp_fotosventa_ruta != undefined) {
      let pictures_otras = JSON.parse(datos.fo_fotosventa_ruta);
      pictures_otras.forEach((item) => {
        this.fotos.push({
          filename: item.filename,
          src: item.url,
        });
      });

      this.activeOptions();
    }

    // PRECIO
    let venta_negociable = true;
    let publicar_autor = true;

    this.formPrecio.get("fprecio").setValue(datos.venta_valor);
    // venta negociable
    if (
      datos.venta_negociable == 0 ||
      datos.venta_negociable == false ||
      datos.venta_negociable == "N"
    ) {
      venta_negociable = false;
    }
    this.formPrecio.get("fnegociable").setValue(venta_negociable);
    // publicar author
    if (
      datos.publicar_autor == 0 ||
      datos.publicar_autor == false ||
      datos.publicar_autor == "N"
    ) {
      publicar_autor = false;
    }
    this.formPrecio.get("fpublicarnombre").setValue(publicar_autor);

    // ESTABLECIENDO LOS FILTROS.
    this.p_filtros["p_clase"] = datos.clase_codigo;
    this.p_filtros["p_marca"] = datos.marca_codigo;
    this.p_filtros["p_modelo"] = datos.venta_modelo;
    this.p_filtros["p_familia"] = datos.linea_familia2;
    this.p_filtros["p_caja"] = datos.linea_caja_cambios;
    this.p_filtros["p_linea"] = datos.linea_codigo;

    this.sendRequest_change(null);
  }

  getEditor() {
    return this.editorComentario.editorInstance;
  }

  public changeDescription({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.comentarios = data;
    this.formChanges();
  }
  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para iniciar los formularios.
   * @version     1.0.0
   * @since       10-12-2019
   */
  initForms() {
    this.formVehiculo = this.formBuilder.group({
      fclase: ["", Validators.required],
      fmarca: ["", Validators.required],
      fmodelo: ["", Validators.required],
      ffamilia: ["", Validators.required],
      fcaja: ["", Validators.required],
      flinea: ["", Validators.required],
    });
    this.formDetalle = this.formBuilder.group({
      fubicacion: ["", Validators.required],
      fciudadmatricula: ["", Validators.required],
      fplaca: ["", Validators.required],
      fkilometraje: ["", Validators.required],
      funicoduenio: [""],
      fnumeroprincipal: [""],
      fnumeroadicional: [""],
      fnumeronuevo: [""],
      fasesor: [""],
      fasesor2: [""],
    });
    this.formEquipamiento = this.formBuilder.group({
      faccesorios: [""],
    });
    this.formPrecio = this.formBuilder.group({
      fprecio: ["", Validators.required],
      fnegociable: [false],
      fpublicarnombre: [false],
    });
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para obtener la informacion de un clasificado.
   * @version     1.0.0
   * @since       10-12-2019
   */
  getRecord() {
    this.loading = true;
    // CONSULTA DE INFORMACION DEL CLASIFICADO.
    this.WebApiService.getRequest(AppComponent.urlService, {
      _p_action: "_publicar",
      p_consecutivo: this.codigo_venta,
    }).subscribe(
      (data) => {
        // console.log(data);
        let datos = data.datos[0];

        // CONSULTAR INFORMACION PRINCIPAL (CLASES, CIUDAD, TELEFONO, ASESORES, ACCESORIOS).
        this.setFormFromData(datos);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           14-11-2019
   * @param           evt eventemitter
   * @description     Metodo usado para manejar los cambios de selects en publicacion
   */
  onChange(evt) {
    this.formChanges();
    if (evt.source.ngControl.name == "fclase") {
      this.p_filtros["p_clase"] = evt.value;
      this.formVehiculo.get("fmarca").setValue("");
      this.formVehiculo.get("ffamilia").setValue("");
      this.formVehiculo.get("fmodelo").setValue("");
      this.formVehiculo.get("fcaja").setValue("");
      this.formVehiculo.get("flinea").setValue("");

      this.p_filtros["p_marca"] = "";
      this.p_filtros["p_familia"] = "";
      this.p_filtros["p_modelo"] = "";
      this.p_filtros["p_linea"] = "";
      this.p_filtros["p_caja"] = "";
      // consultar solo las marcas
      this.sendRequest_change("marcas");
    }

    if (evt.source.ngControl.name == "fmarca") {
      this.p_filtros["p_marca"] = evt.value;
      this.p_filtros["p_familia"] = "";
      this.p_filtros["p_modelo"] = "";
      this.p_filtros["p_linea"] = "";
      this.p_filtros["p_caja"] = "";

      this.formVehiculo.get("ffamilia").setValue("");
      this.formVehiculo.get("fmodelo").setValue("");
      this.formVehiculo.get("fcaja").setValue("");
      this.formVehiculo.get("flinea").setValue("");
      this.sendRequest_change("modelo");
    }

    if (evt.source.ngControl.name == "fmodelo") {
      this.p_filtros["p_modelo"] = evt.value;
      this.p_filtros["p_caja"] = "";
      this.p_filtros["p_linea"] = "";
      this.p_filtros["p_familia"] = "";

      this.formVehiculo.get("ffamilia").setValue("");
      this.formVehiculo.get("fcaja").setValue("");
      this.formVehiculo.get("flinea").setValue("");
      this.sendRequest_change("familia");
    }

    if (evt.source.ngControl.name == "ffamilia") {
      this.p_filtros["p_familia"] = evt.value;
      this.p_filtros["p_linea"] = "";
      this.p_filtros["p_caja"] = "";

      this.formVehiculo.get("fcaja").setValue("");
      this.formVehiculo.get("flinea").setValue("");
      this.sendRequest_change("caja");
    }

    if (evt.source.ngControl.name == "fcaja") {
      this.p_filtros["p_caja"] = evt.value;
      this.p_filtros["p_linea"] = "";
      this.formVehiculo.get("flinea").setValue("");
      this.sendRequest_change("linea");
    }
    if (evt.source.ngControl.name == "flinea") {
      this.p_filtros["p_linea"] = evt.value;
    }
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.1
   * @since           21-10-2019
   * @description     Metodo usado para manejar cambios de selects en publicacion
   */
  sendRequest_change(consulta) {
    switch (consulta) {
      case "marcas":
        //MARCA
        this.p_filtros["p_tabla"] = "marca";
        this.WebApiService.getRequest(
          AppComponent.urlService + "?_p_action=_getGeneral",
          this.p_filtros
        ).subscribe(
          (data) => {
            this.marcas = data.datos;
          },
          (error) => {
            console.log(error);
          }
        );
        break;
      case "familia":
        // FAMILIA
        this.p_filtros["p_tabla"] = "familia";
        this.WebApiService.getRequest(
          AppComponent.urlService + "?_p_action=_getGeneral",
          this.p_filtros
        ).subscribe(
          (data) => {
            data.datos.forEach((familia) => {
              if (familia.fotoslinea_ruta == null) {
                familia.fotoslinea_ruta =
                  "../../../assets/images/imagen-defecto-indicar.jpg";
              }
            });
            this.familia = data.datos;
          },
          (error) => {
            console.log(error);
          }
        );
        break;
      case "modelo":
        //MODELO
        this.p_filtros["p_tabla"] = "modelo";
        this.WebApiService.getRequest(
          AppComponent.urlService + "?_p_action=_getGeneral",
          this.p_filtros
        ).subscribe(
          (data) => {
            this.modelo = data.datos;
          },
          (error) => {
            console.log(error);
          }
        );
        break;
      case "caja":
        //CAJA
        this.p_filtros["p_tabla"] = "caja";
        this.WebApiService.getRequest(
          AppComponent.urlService + "?_p_action=_getGeneral",
          this.p_filtros
        ).subscribe(
          (data) => {
            this.caja = data.datos;
          },
          (error) => {
            console.log(error);
          }
        );
        break;
      case "linea":
        //LINEA
        this.p_filtros["p_tabla"] = "linea";
        this.WebApiService.getRequest(
          AppComponent.urlService + "?_p_action=_getGeneral",
          this.p_filtros
        ).subscribe(
          (data) => {
            this.linea = data.datos;
          },
          (error) => {
            console.log(error);
          }
        );
        break;
      case null: // ejecutado cuando no existe cambio por parte del usuario pero la informacion a cambiado en la recepcion de los datos de la base de datos de algun clasificado publicado.
        this.WebApiService.getRequest(
          AppComponent.urlService,
          Object.assign(this.p_filtros, {
            _p_action: "_getGeneral",
            p_tabla: "all",
          })
        ).subscribe(
          (data) => {
            let datos = data.datos;
            // MARCAS
            let datosMarca = Array();
            let marcas = JSON.parse(datos[0].marcas);
            for (let index in marcas) {
              datosMarca.push({
                campo_codigo: index,
                campo_descripcion: marcas[index],
              });
            }
            this.marcas = datosMarca;
            this.formVehiculo.get("fmarca").setValue(this.p_filtros.p_marca);

            // MODELO
            let datosModelo = Array();
            let modelo = JSON.parse(datos[0].modelos);
            for (let index in modelo) {
              datosModelo.push({
                campo_codigo: index,
                campo_descripcion: modelo[index],
              });
            }
            this.modelo = datosModelo;
            this.formVehiculo.get("fmodelo").setValue(this.p_filtros.p_modelo);

            // FAMILIA
            let datosFamilia = Array();
            let familia = JSON.parse(datos[0].familias);
            for (let index in familia) {
              datosFamilia.push({
                campo_codigo: index,
                campo_descripcion: familia[index],
              });
            }
            this.familia = datosFamilia;
            this.formVehiculo
              .get("ffamilia")
              .setValue(this.p_filtros.p_familia);

            // CAJA
            let datosCaja = Array();
            let caja = JSON.parse(datos[0].cajas);
            for (let index in caja) {
              datosCaja.push({
                campo_codigo: index,
                campo_descripcion: caja[index],
              });
            }
            this.caja = datosCaja;
            this.formVehiculo.get("fcaja").setValue(this.p_filtros.p_caja);

            // LINEA
            let datosLinea = Array();
            let linea = JSON.parse(datos[0].lineas);
            for (let index in linea) {
              datosLinea.push({
                campo_codigo: index,
                campo_descripcion: linea[index],
              });
            }
            this.linea = datosLinea;
            this.formVehiculo.get("flinea").setValue(this.p_filtros.p_linea);
          },
          (error) => {
            console.log(error);
          }
        );
        break;
    }
  }

  // AUTOCOMPLETE FILTER MATRICULA.
  filterOptions(e, filter) {
    let write = e.target.value;
    if (filter == "matricula") {
      this.ciudadesMatricula = this.ciudades.filter((ubicacion) => {
        return ubicacion.ciudad_nombre.search(write.toUpperCase()) != -1;
      });
    } else if (filter == "ubicacion") {
      this.ciudadesUbicacion = this.ciudades.filter((ubicacion) => {
        return ubicacion.ciudad_nombre.search(write.toUpperCase()) != -1;
      });
    }
  }

  displayFn(ciudad?: lovCiudades): string | undefined {
    return ciudad ? ciudad.ciudad_nombre : undefined;
  }

  /* ########################################################### MANEJO DE PASOS EN LOS FORMULARIOS Y VALIDACIONES  ########################################################### */
  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.1
   * @since           10-12-2019
   * @description     Metodo usado para manejar cambios de pasos en el formulario y activar el autoguardado
   */
  steps(index) {
    var excecute = false; //autoguardado.
    switch (index) {
      case 1:
        if (this.formVehiculo.valid) {
          this.headerSteps[index].classList.remove("noview");
          this.stepForward();
          excecute = true;
        } else {
          swal.fire({
            title: "",
            text: "Complete correctamente la información solicitada",
            icon: null,
          });
          excecute = false;
        }
        break;
      case 2:
        if (this.formDetalle.valid) {
          this.headerSteps[index].classList.remove("noview");
          if (
            this.formDetalle.get("fnumeroprincipal").value == "" &&
            this.formDetalle.get("fnumeroadicional").value == ""
          ) {
            swal.fire({
              title: "",
              text: "Debes agregar al menos un número de contacto",
              icon: null,
            });
            excecute = false;
          } else {
            this.stepForward();
            excecute = true;
          }
        } else {
          swal.fire({
            title: "",
            text: "Complete correctamente la información solicitada",
            icon: null,
          });
          excecute = false;
        }
        break;
      case 3:
        if (this.fotos.length == 0) {
          excecute = false;
          swal.fire({
            title: "",
            text: "Agregue fotos del vehículo",
            icon: null,
          });
        } else if (this.fotos.length <= 1) {
          excecute = false;
          swal.fire({
            title: "",
            text: "Debe agregar más fotos del vehículo",
            icon: null,
          });
        } else {
          excecute = true;
          this.headerSteps[index].classList.remove("noview");
          this.stepForward();
        }
        break;
      case 4:
        this.headerSteps[index].classList.remove("noview");
        this.stepForward();
        excecute = true;
        break;
    }
    if (excecute) {
      this.submitBold();
    }
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.1
   * @since           10-12-2019
   * @description     Metodo usado para manejar cambios de pasos en el formulario
   */
  stepPrevious() {
    this.myStepper.previous();
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.1
   * @since           10-12-2019
   * @description     Metodo usado para manejar cambios de pasos en el formulario
   */
  stepForward() {
    this.myStepper.next();
    window.scrollTo(0, 0);
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.1
   * @since           02-01-2020
   * @description     Metodo usado para validar la ubicacion cuando no se selecciona de la lista de autocompletado
   */
  validateUbicacion() {
    if (typeof this.formDetalle.get("fubicacion").value != "object") {
      this.formDetalle.get("fubicacion").setValue("");
    }
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.1
   * @since           02-01-2020
   * @description     Metodo usado para validar la ciudad de matricula cuando no se selecciona de la lista de autocompletado
   */
  validateMatricula() {
    if (typeof this.formDetalle.get("fciudadmatricula").value != "object") {
      this.formDetalle.get("fciudadmatricula").setValue("");
    }
  }

  /* ########################################################### FIN MANEJO DE PASOS EN LOS FORMULARIOS Y VALIDACIONES  ########################################################### */

  /* ########################################################### FUNCIONES DE LA LIBREARIA DE CARGA DE FOTOS ########################################################### */
  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para iniciar la libreria de carga de fotos. asociacion de eventos.
   * @version     1.0.0
   * @since       26-11-2019
   */
  initUploadBold() {
    // formulario
    let fotos = [];

    // secciones
    this.secUploadFile = document.getElementById("uploadFilesBold");

    // funcion de arrastrado

    this.secUploadFile.ondragleave = this.dragleave;
    this.secUploadFile.ondragover = this.dragOver;

    this.secUploadFile.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.modifiedPhotos = true;
      this.editedForm = true;
      // imagenes
      var images = e.dataTransfer.files;

      if (images.length > 0) {
        this.activeOptions();
        this.processImages(images);
        // this.processImages(images,this.checkExtension,this.checkOrientation,this.cutImagePromise);
      }
    });
    // console.log($('#sort-pictures'))
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para manejar los ficheros seleccionados desde el input.
   * @version     1.0.0
   * @since       26-11-2019
   * @param       e evento.
   */
  handleFile(e) {
    let images = e.target.files;

    this.modifiedPhotos = true;
    this.editedForm = true;
    if (images.length > 0) {
      this.activeOptions();
      this.processImages(images);
      // this.processImages(images,this.checkExtension,this.checkOrientation,this.cutImagePromise);
    }
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo para el manejo de over.
   * @version     1.0.0
   * @since       26-11-2019
   */
  dragOver(event) {
    return false;
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo para el manejo de leave.
   * @version     1.0.0
   * @since       26-11-2019
   */
  dragleave(event) {
    return false;
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo para el manejo de boton buscar en fotos.
   * @version     1.0.0
   * @since       26-11-2019
   */
  openfolder() {
    let fo = document.getElementById("fotosotras");
    fo.click();
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para hacer visibles los botones de eliminar y agregar mas fotos.
   * @version     1.0.0
   * @since       26-11-2019
   * @param       active boolean true para indicar que muestre, false para indicar que quite la seccion.
   */
  activeOptions(active = false) {
    if (active) {
      if (document.contains(document.getElementById("opt-otras"))) {
        var optionsOtras = document.getElementById("opt-otras");
        optionsOtras.classList.remove("noview");
      }
      if (document.contains(document.getElementById("options-upload"))) {
        var optionsupload = document.getElementById("options-upload");
        optionsupload.classList.add("noview");
      }
    } else {
      if (document.contains(document.getElementById("opt-otras"))) {
        var optionsOtras = document.getElementById("opt-otras");
        optionsOtras.classList.add("noview");
      }
      if (document.contains(document.getElementById("options-upload"))) {
        var optionsupload = document.getElementById("options-upload");
        optionsupload.classList.remove("noview");
      }
    }
  }

  /**
   * @author      Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @description Metodo usado para procesar las imagenes comprobando su orientacion y extension.
   * @version     1.0.0
   * @since       26-11-2019
   * @param       e evento.
   * @return      boolean true archivo valido (jpeg,jpg,png) o false.
   */
  processImages(images) {
    // numero de imagenes a procesar.

    // loading
    this.loading = true;
    //procesador de imagenes
    for (let i = 0; i < images.length; i++) {
      // imagen
      let image = images[i];
      // CHEQUEAMOS LA EXTENSION DE LA IMAGEN
      this.checkExtension(image)
        //RESULTADOS DE EXTENSION
        .then((validExt) => {
          // CHEQUEAMOS LA ORIENTACION
          var ext;
          ext = validExt;
          let name = ext.file;
          return this.checkOrientation(image, name);
        })
        // RESULTADOS DE ORIENTACION
        .then((result) => {
          if (result != false) {
            let datos;
            datos = result;
            let im = datos.pic;
            // CORTADO DE IMAGENES
            return this.cutImagePromise(im, result);
          } else {
            reject(false);
          }
        })
        // RESULTADO DE CORTE DE IMAGENES
        .then((res) => {
          if (res != false && res != undefined) {
            let data;
            data = res;
            // console.log(data);
            let objData = {
              name: data.name,
              src: data.src,
            };
            this.fotos.push(objData); // array de ordenamiento
          }
          // fotos agregadas en formulario
          // let fotos;
          // fotos = this.formFotos.get('fotosVehiculo');
          // fotos= JSON.parse(fotos);
          // fotos.push(res);
          // fotos = JSON.stringify(fotos);
          // this.formFotos.set('fotosVehiculo',fotos);

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  /**
   * @description   Metodo usado para actualizar el estado de las fotos cargadas.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         09-12-2019
   */
  updatePhotos() {
    let x;
    let img;
    x = event.target;
    img = x.parentNode.querySelector("img");

    x.parentNode.remove();
    this.fotos = this.fotos.filter((f) => {
      return f.src != img.src;
    });
    if (this.fotos.length == 0) {
      this.activeOptions(true);
    }
    this.modifiedPhotos = true;
    this.editedForm = true;
  }

  /**
   * @description   Metodo usado para chequear la extension del archivo cargado.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         26-11-2019
   * @param         image file cargado al navegador.
   * @return        objeto con el nombre del fichero y un valido para la extensio (jpg, png, jpeg).
   */
  checkExtension(image) {
    return new Promise((resolve, reject) => {
      // identifico la extension a paritr del nombre
      let name = image.name.split(".");
      let file = name[0];
      let length = name.length;
      let extension = name[length - 1].toLowerCase();
      //chequeo la extension obtenida
      if (
        extension != "jpg" &&
        extension != "jpeg" &&
        extension != "png" &&
        extension != "jfif"
      ) {
        swal.fire({
          title: "",
          text: "Error al cargar, la extensión del archivo no es compatible. use extensiones: jpg,jfif, jpeg o png.",
          icon: null,
        });
        resolve({
          valid: false,
        });
      } else {
        resolve({
          valid: true,
          file: file,
        });
      }
    });
  }

  /**
   * @description   Metodo usado para chequear la orientacion de la imagen
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         26-11-2019
   * @param         image file cargado al navegador.
   * @return        false o image
   */
  checkOrientation(image, name) {
    return new Promise((resolve, reject) => {
      let orientation, pic, fr;
      pic = new Image();
      fr = new FileReader();

      fr.onload = function () {
        pic.src = fr.result;
      };

      fr.readAsDataURL(image);

      pic.onload = function () {
        EXIF.getData(pic, function () {
          this.allMetaData = EXIF.getAllTags(this);
          orientation = this.allMetaData.Orientation;

          if (orientation > 1) {
            // swal.fire({
            //   title: "",
            //   text: "Error al cargar. Todas las imagenes deben subirse en orientacion 'Horizontal'",
            //   icon: null,
            // });
            resolve(false);
          } else if (
            this.allMetaData.PixelXDimension < this.allMetaData.PixelYDimension
          ) {
            // swal.fire({
            //   title: "",
            //   text: "Error al cargar. Todas las imagenes deben subirse en orientacion 'Horizontal'",
            //   icon: null,
            // });
            resolve(false);
          } else {
            let obj = {
              pic,
              name,
            };

            resolve(obj);
          }
        });
      };
    });
  }

  /**
   * @description   Metodo usado Procesar la imagen reduciendo el tamaño de la imagen y estableciendo un preview.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         26-11-2019
   * @param         image Image. imagen en formato html.
   * @param         name  Nombre de la imagen cargada.
   * @return        Objeto con informacion sobre la imagen cargada
   */
  cutImagePromise(image, result) {
    return new Promise((resolve, reject) => {
      if (!image) {
        resolve(false);
      } else {
        // seccion del canvas
        let ca;
        let bo;
        if (document.contains(document.getElementById("canvasImage"))) {
          ca = document.getElementById("canvasImage");
        } else {
          ca = document.createElement("canvas");
          ca.id = "canvasImage";
          ca.classList.add("noview");
          bo = document.getElementsByTagName("body")[0];
          bo.appendChild(ca);
        }

        // recorte de imagenes
        let ctx = ca.getContext("2d");
        let w, h, tm, r, nw, nh, src, objImage, prev;
        w = image.width;
        h = image.height;
        let nombre;
        // validando orientacion nuevamente.

        if (w < h) {
          nw = 500;
          nh = 900;

          ctx.canvas.width = nw;
          ctx.canvas.height = nh;

          // nuevas dimensiones
          ctx.drawImage(image, 0, 0, nw, nh);

          src = ctx.canvas.toDataURL("image/jpeg", 0.5);

          nombre = result.name + ".jpg";
        } else {
          // nuevas dimensiones y razon.
          if (w >= 1600) {
            // tamaño mayor a 1600px reduzco el tamaño a 2000px
            tm = 1600;
          } else if (w >= 900 && w < 1600) {
            // tamaño mayor a 1600px y menor o igual a 2000px
            tm = 900;
          } else {
            // tamaño original
            tm = w;
          }
          r = tm / w;

          nw = r * w;
          nh = r * h;
          ctx.canvas.width = nw;
          ctx.canvas.height = nh;

          // nuevas dimensiones
          ctx.drawImage(image, 0, 0, nw, nh);
          src = ctx.canvas.toDataURL("image/jpeg", 0.8);

          nombre = result.name + ".jpg";
        }

        objImage = {
          src,
          name: nombre,
        };

        resolve(objImage);
      }
    });
  }

  /**
   * @description   Metodo usado para remover todas las fotos cargadas..
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         09-12-2019
   */
  removeAll() {
    this.fotos = [];
    this.activeOptions(true);
    let inputFotos;
    inputFotos = document.getElementById("fotosotras");
    inputFotos.value = "";
    this.modifiedPhotos = true;
    this.editedForm = true;
  }
  /* ########################################################### FIN FUNCIONES DE LA LIBREARIA DE CARGA DE FOTOS ########################################################### */

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   * @description     Metodo usado para activar guardado por cambios en los formularios.
   */
  formChanges() {
    this.editedForm = true;
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   * @description     Metodo usado para activar guardado de fotos por cambio o por iniciar formulario de edicion.
   */
  modifyPictures() {
    this.editedForm = true;
    this.modifiedPhotos = true;
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.0
   * @since           10-12-2019
   * @description     Metodo usado para manejar Autoguardado y guardado de los clasificados.
   */
  submitBold(autoSave = null) {
    this.publicar = true;
    this.loading = true;

    var allData = {};
    let status_completed = 0;
    let mensajeFinal = false;

    if (this.editedForm) {
      // envio formularios. FUERON EDITADOS.
      // AUTOGUARDADO

      if (autoSave == null) {
        // autoguardado.
        this.modifiedPhotos = true; // indica que las fotos inicialmente deben tomarse en cuenta.
        // LINEA O VEHICULO
        let publicarNombre = false;

        if (this.isConcesionario) {
          publicarNombre = true;
        } else {
          publicarNombre = this.formPrecio.get("fpublicarnombre").value;
        }
        let form_linea = {
          cClase: this.formVehiculo.get("fclase").value,
          cMarca: this.formVehiculo.get("fmarca").value,
          cFamilia: this.formVehiculo.get("ffamilia").value,
          cModelo: this.formVehiculo.get("fmodelo").value,
          cCaja: this.formVehiculo.get("fcaja").value,
          cLinea: this.formVehiculo.get("flinea").value,
          recibir_alertas: 1,
          publicar_nombre: publicarNombre,
        };
        // CONTACTO O DETALLE
        let form_contacto = {
          ubicacion_vehiculo: this.formDetalle.get("fubicacion").value,
          ubicacion_matricula: this.formDetalle.get("fciudadmatricula").value,
          vehiculo_placa: this.formDetalle.get("fplaca").value,
          vehiculo_kilometraje: this.formDetalle.get("fkilometraje").value,
          // vehiculo_comentario:             (this.formDetalle.get('fcomentarios').value!= undefined)? this.formDetalle.get('fcomentarios').value.slice(3,-4):"",
          // vehiculo_comentario:             (this.comentarios != undefined)? this.comentarios.slice(3,-4):"",
          vehiculo_comentario:
            this.comentarios != undefined ? this.comentarios : "",
          vehiculo_unicopropietario: this.formDetalle.get("funicoduenio").value,
          telefono_principal: this.formDetalle.get("fnumeroprincipal").value,
          // telefono_otro:                   this.formDetalle.get('fnumeroadicional').value,
          telefono_adicional: this.formDetalle.get("fnumeroadicional").value,
          nombre_asesor: this.formDetalle.get("fasesor").value,
          nombre_asesor2: this.formDetalle.get("fasesor2").value,
        };
        // ACCESORIOS O EQUIPAMIENTO
        let form_accesorios = {
          publicar_accesorios: this.formEquipamiento.get("faccesorios").value,
        };
        // PRECIO
        let form_precio = {
          precio_venta: this.formPrecio.get("fprecio").value,
          precio_negociable: this.formPrecio.get("fnegociable").value,
        };

        allData = {
          form_linea,
          form_contacto,
          form_accesorios,
          form_precio,
          p_changes: this.editedForm,
          p_consecutivo: this.codigo_venta,
          p_prueba: "S",
          status_completed,
        };

        // IMAGENES
        let imagen_principal = [];
        let imagenes_otras = [];
        if (this.modifiedPhotos) {
          // SI IMAGENES FUERON MODIFICADAS.  agrego las imagenes al formulario de envio.
          // IMAGEN PRINCIPAL
          let principal = [];
          let secundaria = [];

          for (let index = 0; index < this.fotos.length; index++) {
            const element = this.fotos[index];

            if (element.filename == "1-PRINCIPAL") {
              principal.push(element);
            } else {
              secundaria.push(element);
            }
          }
          if (this.fotos[0] != undefined) {
            imagen_principal.push(this.fotos[0]);
          }

          // OTRAS IMAGENES
          this.fotos.forEach((photo, index) => {
            if (index > 0) {
              imagenes_otras.push(photo);
            }
          });

          allData["imagen_principal"] = principal;
          allData["imagenes_otras"] = secundaria;

          this.modifiedPhotos = true;
        }
      } else {
        // GUARDADO FINAL

        status_completed = 1;
        mensajeFinal = true;
        this.cambio = true;
        // console.log(this.formPrecio.valid);
        if (!this.formPrecio.valid) {
          swal.fire({
            title: "",
            text: "Debe agregar una cifra válida",
            icon: null,
          });
          this.loading = false;
          return;
        }
        let publicarNombre = false;
        if (this.isConcesionario) {
          publicarNombre = true;
        } else {
          publicarNombre = this.formPrecio.get("fpublicarnombre").value;
        }

        // LINEA O VEHICULO
        let form_linea = {
          cClase: this.formVehiculo.get("fclase").value,
          cMarca: this.formVehiculo.get("fmarca").value,
          cFamilia: this.formVehiculo.get("ffamilia").value,
          cModelo: this.formVehiculo.get("fmodelo").value,
          cCaja: this.formVehiculo.get("fcaja").value,
          cLinea: this.formVehiculo.get("flinea").value,
          recibir_alertas: 1,
          publicar_nombre: publicarNombre,
        };
        // CONTACTO O DETALLE
        let form_contacto = {
          ubicacion_vehiculo: this.formDetalle.get("fubicacion").value,
          ubicacion_matricula: this.formDetalle.get("fciudadmatricula").value,
          vehiculo_placa: this.formDetalle.get("fplaca").value,
          vehiculo_kilometraje: this.formDetalle.get("fkilometraje").value,
          // vehiculo_comentario:             (this.formDetalle.get('fcomentarios').value!= undefined)? this.formDetalle.get('fcomentarios').value.slice(3,-4):"",
          // vehiculo_comentario:             this.formDetalle.get('fcomentarios').value,
          vehiculo_comentario: this.comentarios,
          vehiculo_unicopropietario: this.formDetalle.get("funicoduenio").value,
          telefono_principal: this.formDetalle.get("fnumeroprincipal").value,
          // telefono_otro:                   this.formDetalle.get('fnumeroadicional').value,
          telefono_adicional: this.formDetalle.get("fnumeroadicional").value,
          nombre_asesor: this.formDetalle.get("fasesor").value,
          nombre_asesor2: this.formDetalle.get("fasesor2").value,
        };
        // ACCESORIOS O EQUIPAMIENTO

        let form_accesorios = {
          publicar_accesorios: this.formEquipamiento.get("faccesorios").value,
        };
        // PRECIO
        let form_precio = {
          precio_venta: this.formPrecio.get("fprecio").value,
          precio_negociable: this.formPrecio.get("fnegociable").value,
        };
        allData = {
          form_linea,
          form_contacto,
          form_accesorios,
          form_precio,
          p_changes: this.editedForm,
          p_consecutivo: this.codigo_venta,
          p_prueba: "S",
          status_completed,
        };
        // IMAGENES
        let imagen_principal = [];
        let imagenes_otras = [];
        if (this.modifiedPhotos) {
          // SI IMAGENES FUERON MODIFICADAS.  agrego las imagenes al formulario de envio.
          // IMAGEN PRINCIPAL

          if (this.fotos[0] != undefined) {
            imagen_principal.push(this.fotos[0]);
          }
          // OTRAS IMAGENES
          this.fotos.forEach((photo, index) => {
            if (index > 0) {
              imagenes_otras.push(photo);
            }
          });

          allData["imagen_principal"] = imagen_principal;
          allData["imagenes_otras"] = imagenes_otras;
          this.modifiedPhotos = false;
        }
      }

      this.loading = false;
      if (this.cambio) {
        this.mensajeFinal();
      }

      if (this.codigo_venta == null) {
        this.WebApiService.postRequest(AppComponent.urlService, allData, {
          _p_action: "_publicar",
        }).subscribe(
          (data) => {
            if (mensajeFinal) {
              this.cambio = false;

                this.eventGoogle() ;

              this.snackBar.open("¡Información cargada!", "Aceptar", {
                duration: 3000,
              });
              this.router.navigate([
                "/usuario",
                { outlets: { "cuenta-opcion": ["clasificado", "P"] } },
              ]);
            }
          },
          (error) => {
            this.loading = false;
          }
        );
      } else {
        this.WebApiService.postRequest(AppComponent.urlService, allData, {
          _p_action: "_publicarUpdate",
        }).subscribe(
          (data) => {
            if (mensajeFinal) {
              this.cambio = false;
              this.snackBar.open("¡Información cargada!", "Aceptar", {
                duration: 3000,
              });
              this.router.navigate([
                "/usuario",
                { outlets: { "cuenta-opcion": ["clasificado", "P"] } },
              ]);
            }
          },
          (error) => {
            this.loading = false;
          }
        );
      }
    } else {
      this.loading = false;
      if (autoSave != null) {
        // guardado final sin cambios
        this.editedForm = true;
        this.submitBold(1);
      }
      return;
    }
  }

  mensajeFinal() {
   swal.fire({
      title: "Guardando publicación!",
      imageUrl:
        "https://grupoceleritas.com/soporte.gif",
        imageHeight: 200,

      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    this.router.navigate([
      "/usuario",
      { outlets: { "cuenta-opcion": ["clasificado", "P"] } },
    ]);

  }
  eventGoogle() {




     gtag('event', 'Publicar Clasificado', { 'event_category': ' clasificado', 'event_action': 'publicar',

                         'event_label': 'publicar_clasificado', 'value': '0'});
  }
}
