import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValoradorService } from "../servicios/valorador.service";
import { MatStepper } from "@angular/material";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WebApiService } from "src/app/servicios/web-api.service";

import { AppComponent } from "src/app/app.component";
import swal from "sweetalert2";
declare var EXIF: any;

@Component({
  templateUrl: "./valorador.component.html",
  styleUrls: ["./valorador.component.css"],
})
export class ValoradorComponent implements OnInit {
  formVehiculo: FormGroup;
  public maskphone = "(000) 000 0000";
  formularioFormGroup: FormGroup;
  isLinear = false;
  listClase: any = [];
  ListMarcas: any = [];
  ListModelos: any = [];
  ListFamilia: any = [];
  ListVersiones: any = [];
  cliente: any = [];
  listCiudades: any = [];
  llantas = [
    { value: "0" },
    { value: "1" },
    { value: "2" },
    { value: "3" },
    { value: "4" },
  ];

  cantidad = [
    { value: "0" },
    { value: "1" },
    { value: "2" },
    { value: "3" },
    { value: "4" },
    { value: "5" },
    { value: "6" },
    { value: "7" },
    { value: "8" },
    { value: "9" },
    { value: "10" },
  ];

  tipoPersona = [
    { id: 1, name: "Natural" },
    { id: 2, name: "Concesionario" },
  ];

  tipoAccon = [
    { id: 3, name: "Vender" },
    { id: 4, name: "Comprar" },
  ];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  public natural = false;
  public concesionario = false;

  public vender = false;
  public comprar = false;

  /**
    listado de todas las respuestas
   */
  list_respuestas: any = [];

  valorVehiculo;
  encontrado = false;
  variasRespuesta: any = [];
  checkBox: any = [];
  // estado de llantas
  nuevas = 0;
  normal = 0;
  cambio = 0;
  validacion = false;
  ciudades: any = [];
  isOptional = false;
  //Para guardar las respuestas de tipo 3
  dataGlobal: any = [];
  guardarGlobal: any = [];
  guardar: any = {};
  valorGlobal = 0;
  pregunta = 0;

  listPreguntas: any = [];

  formulario: FormGroup;

  @ViewChild("stepper", { read: null, static: false })
  private myStepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private WebApiService: WebApiService,
    private _valoradorService: ValoradorService
  ) {
    this.ObtenerPreguntas();
  }

  ngOnInit() {
    this.formVehiculo = this.formBuilder.group({
      fclase: ["", Validators.required],

      fmarca: ["", Validators.required],
      fmodelo: ["", Validators.required],
      ffamilia: ["", Validators.required],
      flinea: ["", Validators.required],
      nombre: [""],
      email: [""],
      telefono: [""],
      ciudad: ["", Validators.required],
    });

    this.formularioFormGroup = this.formBuilder.group({
      secondCtrl: ["", Validators.required],
    });
    this.cliente = JSON.parse(localStorage.getItem("currentUser"));

  this.formVehiculo.value.nombre=this.cliente.name;
  this.formVehiculo.value.telefono=this.cliente.telefono;
  this.formVehiculo.value.email=this.cliente.username;
    this.getCiudades();
    this.getClases();
  }

  getClases() {
    this._valoradorService.getData("vehiculos/clases").subscribe(
      (res) => {
        this.listClase = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getMarcas() {
    this._valoradorService.getData("vehiculos/marcas").subscribe(
      (res) => {
        this.ListMarcas = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onChange(dt) {
    switch (dt) {
      case 1:
        this._valoradorService
          .getData("vehiculos/marcas?clase=" + this.formVehiculo.value.fclase)
          .subscribe(
            (res) => {
              this.ListMarcas = res;
            },
            (err) => {
              console.log(err);
            }
          );
        break;

      case 2:
        this._valoradorService
          .getData(
            "vehiculos/modelos?marca=" +
              this.formVehiculo.value.fmarca +
              "&clase=" +
              this.formVehiculo.value.fclase
          )
          .subscribe(
            (res) => {
              this.ListModelos = res;
            },
            (err) => {
              console.log(err);
            }
          );
        break;
      case 3:
        this._valoradorService
          .getData(
            "vehiculos/familias?marca=" +
              this.formVehiculo.value.fmarca +
              "&clase=" +
              this.formVehiculo.value.fclase +
              "&modelo=" +
              this.formVehiculo.value.fmodelo
          )
          .subscribe(
            (res) => {
              this.ListFamilia = res;
              // console.log(this.ListFamilia);
            },
            (err) => {
              console.log(err);
            }
          );
        break;
      case 4:
        this._valoradorService
          .getData(
            "vehiculos/lineas?marca=" +
              this.formVehiculo.value.fmarca +
              "&clase=" +
              this.formVehiculo.value.fclase +
              "&modelo=" +
              this.formVehiculo.value.fmodelo +
              "&familia=" +
              this.formVehiculo.value.ffamilia
          )
          .subscribe(
            (res) => {
              this.ListVersiones = res;
            },
            (err) => {
              console.log(err);
            }
          );
        break;
    }
  }
  getCiudades() {
    this._valoradorService.getData("obtenerCiudades").subscribe(
      (res) => {
        this.listCiudades = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  /**
      Metodo para obtener todas las preguntas
   */

  ObtenerPreguntas() {
    this._valoradorService.getData("obtenerPreguntas ").subscribe(
      (res) => {
        let data = res;
        let contador = 11;

        for (let index = 0; index < res.length; index++) {
          const element = res[index];

          if (element.vainpreg_codigo == contador) {
            this.encontrado = element;

            data.splice(index, 1);
            data.unshift(this.encontrado);
          }
        }

        this.listPreguntas = data;
        console.log(  this.listPreguntas);
        // console.log(this.listPreguntas);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // Método para las preguntas
  // ────────────────────────────────────────────────────────────────────────────────

  tipoQuestion(question, request, value) {

    switch (question.vainpreg_tipopregunta) {
      case 1:
        let json = {
          idPregunta: question.vainpreg_codigo,

          valor: request.value,
        };

        var validacion = this.validarExistente(
          this.list_respuestas,
          question.vainpreg_codigo
        );

        if (validacion) {
          this.list_respuestas.push(json);
        } else {
          this.list_respuestas.push(json);
        }
        break;
      case 2:
        let respuesta = {
          idPregunta: question.vainpreg_codigo,
          respuesta: {
            idRespuesta: request.vainresp_codigo,
            valor: parseInt(value),
          },
        };

        if (this.dataGlobal.length == 0) {
          this.dataGlobal.push(respuesta);
        } else {
          let validar = this.validarRepuestaMultiple(request.vainresp_codigo);

          this.dataGlobal.push(respuesta);
        }

        break;
      case 3:
        this.pregunta = question.vainpreg_codigo;

        if (this.guardarGlobal.length == 0) {
          this.guardarGlobal.push(request.vainresp_codigo);
        } else {
          var validacion = this.validarRespuestaSeleccionadas(
            request.vainresp_codigo
          );

          if (!validacion) {
            this.guardarGlobal.push(request.vainresp_codigo);
          }
        }

        break;
      case 4:
        let idRespuesta = 0;
        this.TipoCuatro(question, request, value);

        if (this.natural == true && this.vender == true) {
          idRespuesta = 134;
        } else if (this.natural == true && this.comprar == true) {
          idRespuesta = 133;
        } else if (this.concesionario && this.vender) {
          idRespuesta = 136;
        } else if (this.concesionario && this.comprar) {
          idRespuesta = 135;
        }

        if (idRespuesta != 0) {
          let jsn = {
            idPregunta: question.vainpreg_codigo,
            valor: idRespuesta,
          };

          var validacion = this.validarExistente(
            this.list_respuestas,
            question.vainpreg_codigo
          );

          if (validacion) {
            this.list_respuestas.push(jsn);
          } else {
            this.list_respuestas.push(jsn);
          }
        }

        break;
      case 5:
        let string = request.target.value;
        let number = parseInt(string.replace(/\./g, ""));
        let js = {
          idPregunta: question.vainpreg_codigo,

          valor: number,
        };

        var validacion = this.validarExistente(
          this.list_respuestas,
          question.vainpreg_codigo
        );

        if (validacion) {
          this.list_respuestas.push(js);
        } else {
          this.list_respuestas.push(js);
        }

        break;
    }
  }

  validarExistente(array, id) {
    var validar = false;
    var indice = 0;
    for (let index = 0; index < this.list_respuestas.length; index++) {
      const element = array[index];

      if (element.idPregunta == id) {
        validar = true;
        indice = index;
      }
    }
    if (validar) {
      this.list_respuestas.splice(indice, 1);
    }

    return validar;
  }
  validarRepuestaMultiple(id) {
    var validar = false;
    var indice = 0;

    for (let index = 0; index < this.dataGlobal.length; index++) {
      const element = this.dataGlobal[index];

      if (element.respuesta.idRespuesta == id) {
        validar = true;
        indice = index;
        break;
      }
    }
    if (validar) {
      this.dataGlobal.splice(indice, 1);
    }

    return validar;
  }
  validarRespuestaSeleccionadas(id) {
    var validar = false;
    var indice = 0;

    for (let index = 0; index < this.guardarGlobal.length; index++) {
      const element = this.guardarGlobal[index];

      if (element == id) {
        validar = true;
        indice = index;
        break;
      }
    }
    if (validar) {
      this.guardarGlobal.splice(indice, 1);
    }

    return validar;
  }

  TipoCuatro(question, request, value) {
    if (request.value == 1) {
      this.natural = true;
      this.concesionario = false;
    } else if (request.value == 2) {
      this.natural = false;
      this.concesionario = true;
    }
    if (request.value == 3) {
      this.vender = true;
      this.comprar = false;
    } else if (request.value == 4) {
      this.comprar = true;
      this.vender = false;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // ─────────────────────────────Metodo para validar si ya existe una respuesta─────
  // ────────────────────────────────────────────────────────────────────────────────
  LimpiarData() {
    location.reload();
  }
  // ────────────────────────────────────────────────────────────────────────────────
  // ──────────────────────────enviar y guardar la consulta──────────────────────────
  // ────────────────────────────────────────────────────────────────────────────────

  onSubmit(id) {

    switch (id) {
      case 1:
        this.formVehiculo.value.nombre = this.cliente.name;
        this.formVehiculo.value.email = this.cliente.username;
        this.formVehiculo.value.telefono = this.cliente.telefono;
        let data = this.formVehiculo.value;

        this._valoradorService.postData("obtenerPrecio", data).subscribe(
          (res) => {
            if (res.success == 1) {
              this.valorVehiculo = res.valorActual;
              this.validacion = true;
            } else {
              this.valorVehiculo = res.msj;
              this.validacion = false;

              swal.fire({
                title: "",
                text: res.msj,
                icon: null,
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );

        break;
      case 2:
        if (this.list_respuestas.length == 0) {
          swal.fire({
            title: "",
            text: "aun no estan todas las preguntas resueltas",
            icon: null,
          });
        } else {
          //Guardamos la pregunta numero 15
          if (this.pregunta != 0) {
            let jsn = {
              idPregunta: 15,
              respuesta: this.guardarGlobal,
            };
            this.list_respuestas.push(jsn);
            this.pregunta = 0;
          }



        for (let index = 0; index < this.list_respuestas.length; index++) {
          const element = this.list_respuestas[index];
          if (element.idPregunta==13 || element.idPregunta==17 || element.idPregunta==14) {
              this.list_respuestas.splice(index,1);
          }

        }


          //Codigo para buscar los que se repite en el arreglo dataGlobal
          // este arreglo es solo para los tipo dos
          for (let index = 0; index < this.dataGlobal.length; index++) {
            const element = this.dataGlobal[index];
            if (element.idPregunta != 14) {
              this.list_respuestas.push(element);
            } else {
              this.variasRespuesta.push(element);
            }
          }

          if (this.variasRespuesta != null) {
            let rPrimera = this.variasRespuesta[0].respuesta;
            let rSegunda = this.variasRespuesta[1].respuesta;

            let rTercera = this.variasRespuesta[2].respuesta;
            let question14 = {
              idPregunta: 14,
              respuesta: [rPrimera, rSegunda, rTercera],
            };

            this.variasRespuesta == null;
            this.list_respuestas.push(question14);
          }
          // Fin del codigo de busqueda

          //Eliminamos las preguntas que de pronto se repitan

          var hash = {};
          this.list_respuestas = this.list_respuestas.filter(function (
            current
          ) {
            var exists = !hash[current.idPregunta];
            hash[current.idPregunta] = true;
            return exists;
          });
          //console.log(this.formVehiculo.value);
          let dataFinal = {
            nombre: this.formVehiculo.value.nombre,
            telefono: this.formVehiculo.value.telefono,
            email: this.formVehiculo.value.email,
            fmarca: this.formVehiculo.value.fmarca,
            fmodelo: this.formVehiculo.value.fmodelo,
            ffamilia: this.formVehiculo.value.ffamilia,

            flinea: this.formVehiculo.value.flinea,
            ciudad: this.formVehiculo.value.ciudad,
            respuesta: this.list_respuestas,
          };

          this._valoradorService
            .postData("calcularPrecio", dataFinal)
            .subscribe(
              (res) => {
                // console.log(res);
                if (res.valorCalculado) {
                  this.valorGlobal = res.valorCalculado;
                } else {
                  swal.fire({
                    title: "",
                    text: res.msj,
                    icon: null,
                  });
                }
              },
              (err) => {
                swal.fire({
                  title: "",
                  text: err.msj,
                  icon: null,
                });
              }
            );
        }

        break;
    }
  }
}
