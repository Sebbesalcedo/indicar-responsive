import { Component, OnInit } from "@angular/core";
import { GlobalService } from "./../servicios/global.service";
import { Router, ActivatedRoute } from "@angular/router";
import { WebApiService } from "src/app/servicios/web-api.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { formatCurrency, getCurrencySymbol } from "@angular/common";
import { EncryptService } from "src/app/servicios/encrypt.service";
import { AppComponent } from "src/app/app.component";

import swal from "sweetalert2";

@Component({
  selector: "app-wompi-forms",
  templateUrl: "./wompi-forms.component.html",
  styleUrls: ["./wompi-forms.component.css"],
})
export class WompiFormsComponent implements OnInit {
  // public UrlWompi: string = "http://localhost/api-wompi/public/";
  public UrlWompi: string =
    "http://hsalcedo.frontend.pruebasindicar.local/backend/public/";

  urlWompi = "https://checkout.wompi.co/p/";
  // urlFacturacion = "http://localhost/facturacion/agendamientoweb.php";
  urlFacturacion =
    " http://hsalcedo.frontend.pruebasindicar.local/facturacion/agendamientoweb.php";
  isLinear = false;
  public publicKey = "pub_test_JSvJdXZovGxoPpWX8bgDDMoEMRigMMzE";
  public currency = "COP";
  public amountInCents = "3000000";
  public reference;
  public redirectUrl =
    "http://hsalcedo.frontend.pruebasindicar.local/resumen_pago";

  wompiForms: FormGroup;
  personaNatural: FormGroup;
  personaJuridica: FormGroup;
  public maskphone = "(000) 000 0000";

  public codigoVehiculo;
  public placaVehiculo;

  p_filtros: any = [];
  datos: any = [];
  public tIdentificacion;
  public nombreCompleto;

  imagenes: any = [];

  tipoIdentificacion: any = [];
  tipoPersona: any = [];
  departamentos: any = [];
  depatamentoEncontrado;
  ciudadEncontrada;
  ciudades: any[];
  encontrado=false;
  public encontrar=false;

  ciudad="";
  disable = false;
  existeCliente = false;
  loading = true;
  buscar = false;

  public terminos_condiciones;
  public valorTransaccion;
  public existente = true;
  public spinner = true;
  public mensaje ;
  public checkTerminos:Boolean =false;
    "En este momento no tenemos información registra de este vehiculo";
  constructor(
    private WebApiService: WebApiService,
    private formBuilder: FormBuilder,
    private encrypt: EncryptService,
    private globalService: GlobalService,
    private activatedRouter: ActivatedRoute
  ) {
    this.codigoVehiculo = this.activatedRouter.snapshot.params.id;
    this.p_filtros["p_codigo"] = this.codigoVehiculo;

    this.sendRequest();
    this.getRequest();
  }

  ngOnInit() {
    this.wompiForms = this.formBuilder.group({
      pKey: ["", Validators.required],
      pCurrency: ["", Validators.required],
      pValor: ["", Validators.required],
      pReference: ["", Validators.required],
      pUrl: ["", Validators.required],
      pIva: ["", Validators.required],
      pConsum: ["", Validators.required],
    });

    this.personaNatural = this.formBuilder.group({
      idReferencia: [""],
      tPersona: ["", Validators.required],
      tpIdentificacion: ["", Validators.required],
      pNombre: ["", Validators.required],
      sNombre: [""],
      pApellido: ["", Validators.required],
      sApellido: [""],
      dVerificacionNIT: [""],
      numero_identificacion: ["", Validators.required],
      codigo_vehiculo: [""],
      placa: [""],
      dCelular: ["", Validators.required],
      dTelefono: ["", Validators.required],
      departamento: ["", Validators.required],
      ciudad: [0, Validators.required],
      dEmail: ["", Validators.required],
      dDireccion: ["", Validators.required],
      valor_pago: [""],

      Estado_transaccion: ["CREADO", Validators.required],
    });
  }


checkValue(event: any){
  this.checkTerminos=event.checked;

}
  /**
    Metodo que consulta la información del vehiculo mediante el codigo que le pasa por url
   */

  sendRequest() {
    // VEHICULO
    this.WebApiService.getRequest(
      AppComponent.urlService,
      Object.assign(this.p_filtros, {
        _p_action: "_usadodetalle",
      })
    ).subscribe(
      (data) => {
        this.placaVehiculo = data.datos[0].venta_matricula_placa;
        this.validarPlacaVehiculo();
      },
      (error) => {
        console.log(error);
      }
    );
    // ACCESORIOS O EQUIPAMIENTO

    // IMAGENES
    this.WebApiService.getRequest(
      AppComponent.urlService,
      Object.assign(this.p_filtros, {
        _p_action: "_usadodetalleimagenes",
      })
    ).subscribe(
      (data) => {
        let dt = data.datos;

        for (let index = 0; index < dt.length; index++) {
          const element = dt[index];

          this.imagenes.push(element.fotosventa_ruta);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getRequest() {
    //extraer tipo de identificación
    this.WebApiService.getDt(
      this.urlFacturacion,

      {
        accion: "gettipos",
      }
    ).subscribe(
      (res) => {
        console.log(res);
        this.tipoIdentificacion = res.datos.retorno;
      },
      (err) => {
        console.log(err);
      }
    );

    //Extraer los tipos de persona

    this.WebApiService.getDt(
      this.urlFacturacion,

      {
        accion: "tipopersona",
      }
    ).subscribe(
      (res) => {


        this.tipoPersona = res.datos.retorno;
      },
      (err) => {
        console.log(err);
      }
    );

    //Obtener la lista de departamentos

    this.WebApiService.getDt(
      this.urlFacturacion,

      { accion: "getDepartamento" }
    ).subscribe(
      (res) => {

        this.departamentos = res.datos.retorno;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCiudades(event) {
    this.depatamentoEncontrado = parseInt(event);

    this.WebApiService.getDt(
      this.urlFacturacion,

      {
        accion: "getCiudad",
        body: this.depatamentoEncontrado,
      }
    ).subscribe(
      (res) => {
        console.log(res);
        this.ciudades = res.datos.retorno;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  buscarInformacion(event) {
    this.buscar = true;
    let data = parseInt(event.target.value);
    this.WebApiService.getDt(
      this.urlFacturacion,

      {
        accion: "getTercero",
        cedula: data,
      }
    ).subscribe(
      (res) => {
        if (res.datos.retorno == null) {
          this.existeCliente = false;
          this.buscar = false;
          swal.fire("", "No te encuentras registrado.", "warning");
        } else {
          this.existeCliente = true;
          this.buscar = false;
          swal.fire("", "Ya te encuentras registrado.", "success");
          this.tIdentificacion =
            res.datos.retorno[0].tercero_tipoidentificacion_d;
          this.disable = true;
          this.personaNatural.value.tPersona =
            res.datos.retorno[0].tercero_tipopersona;
          this.personaNatural.value.tpIdentificacion =
            res.datos.retorno[0].tercero_tipoidentificacion;
          this.personaNatural.value.pNombre =
            res.datos.retorno[0].tercero_nombre1;
          this.personaNatural.value.sNombre =
            res.datos.retorno[0].tercero_nombre2;
          this.personaNatural.value.pApellido =
            res.datos.retorno[0].tercero_apellido1;
          this.personaNatural.value.sApellido =
            res.datos.retorno[0].tercero_apellido2;
          this.personaNatural.value.dDireccion =
            res.datos.retorno[0].tercero_direccion;
          this.personaNatural.value.dEmail = res.datos.retorno[0].tercero_email;
          this.personaNatural.value.dCelular =
            res.datos.retorno[0].tercero_celular;
          this.personaNatural.value.dTelefono =
            res.datos.retorno[0].tercero_telefonocasa;

          this.personaNatural.value.departamento =
            res.datos.retorno[0].tercero_departamento;

          this.depatamentoEncontrado =
            res.datos.retorno[0].tercero_departamento;

          this.getCiudades(this.depatamentoEncontrado);
          this.encontrado=true;
          this.ciudad=res.datos.retorno[0].tercero_ciudad_d;
          this.personaNatural.value.ciudad = parseInt(res.datos.retorno[0].tercero_ciudad);




        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
    Validar si intempo-vehiscore tiene la información del vehiculo
    @return retorna true si existe la información vehicular, false de lo contrario
   */

  validarPlacaVehiculo() {
    let ruta = this.UrlWompi + "validarPlaca";
    let data = { placa: this.placaVehiculo };
    this.globalService.postData(ruta, data).subscribe(
      (res) => {
        if (res.data) {
          this.existente = false;
          this.consultarTerminosWompi();
          this.consultarPrecio();
          this.generadorReferencia();
        } else {
          swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No tenemos información de este vehiculo ",
          });
          this.spinner = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  validarTipoPersona(event) {
    console.log(event);
    this.personaNatural.value.tpIdentificacion = event.value;
  }

  /**
    consultar los terminos y condiciones de Wompi
   */

  consultarTerminosWompi() {
    let ruta = this.UrlWompi + "conexionWompi";
    this.globalService.getPago(ruta).subscribe(
      (res) => {
        this.terminos_condiciones =
          res.data.data.presigned_acceptance.permalink;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  /**
    Metodo que permite consultar a la base de datos el valor de la transacción
   */
  consultarPrecio() {
    let ruta = this.UrlWompi + "consultarValor";
    this.globalService.getPago(ruta).subscribe(
      (res) => {
        for (let index = 0; index < res.length; index++) {
          const element = res[index];

          this.valorTransaccion = element.valor_pago;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
    Metodo que permite consultar una nueva referencia de pago
   */

  generadorReferencia() {
    let ruta = this.UrlWompi + "generarReferencia";
    this.globalService.getPago(ruta).subscribe(
      (res) => {
        this.reference = res.referen;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
    Metodo que permite guardar los datos en la base de dato
    @params form, evento de wompi del formulario
    @return
   */

  guardarDatos(form) {
    this.nombreCompleto = this.personaNatural.value.pNombre;
    this.personaNatural.value.idReferencia = this.reference;
    this.personaNatural.value.codigo_vehiculo = this.codigoVehiculo;
    this.personaNatural.value.placa = this.placaVehiculo;
    if (this.tIdentificacion != null) {
      this.personaNatural.value.tpIdentificacion = this.tIdentificacion;
    }
    this.personaNatural.value.valor_pago = this.valorTransaccion;
    this.personaNatural.value.valor_pago = this.valorTransaccion;
    this.personaNatural.value.terminos = true;
    let data = this.personaNatural.value;
    let ruta = this.UrlWompi + "referencias";


    if (this.checkTerminos  ) {
      this.loading = false;
      //si el cliente no existe lo agrega

      if (this.existeCliente == false) {
        this.WebApiService.getDt(
          this.urlFacturacion,

          {
            accion: "crearTercero",
            identificacion: this.personaNatural.value.tpIdentificacion,
            tipoPersona: this.personaNatural.value.tPersona,
            nIdentificacion: this.personaNatural.value.numero_identificacion,
            pNombre: this.personaNatural.value.pNombre,
            sNombre: this.personaNatural.value.sNombre,
            pApellido: this.personaNatural.value.pApellido,
            sApellido: this.personaNatural.value.sApellido,
            departamento: this.personaNatural.value.departamento,
            ciudad: this.personaNatural.value.ciudad,
            dDireccion: this.personaNatural.value.dDireccion,
            dTelefono: this.personaNatural.value.dTelefono,
            dCelular: this.personaNatural.value.dCelular,
            dEmail: this.personaNatural.value.dEmail,
          }
        ).subscribe(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.log(err);
          }
        );
      }

      // Guardar en la base de datos de indicar referencias
      this.globalService.postData(ruta, data).subscribe(
        (res) => {
          this.reference = res.referen;

            form.submit();

        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      swal.fire({
        icon: "error",
        title: "Oops...",
        text: "llena los datos del formulario ",
      });
    }
  }
}
