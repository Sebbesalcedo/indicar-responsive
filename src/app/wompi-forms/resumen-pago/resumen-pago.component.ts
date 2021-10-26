import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../servicios/global.service";
import { WebApiService } from "src/app/servicios/web-api.service";
// import { format, compareAsc } from 'date-fns';
import swal from "sweetalert2";

@Component({
  selector: "app-resumen-pago",
  templateUrl: "./resumen-pago.component.html",
  styleUrls: ["./resumen-pago.component.css"],
})
export class ResumenPagoComponent implements OnInit {
  //public UrlWompi: string = "https://apiwompi.mercurylab.com.co/public/";
  // public UrlWompi: string = "http://localhost/api-wompi/public/";
  public UrlWompi: string =
    "http://hsalcedo.frontend.pruebasindicar.local/backend/public/";
  // urlFacturacion = "http://localhost/facturacion/agendamientoweb.php";
  urlFacturacion =
    " http://hsalcedo.frontend.pruebasindicar.local/facturacion/agendamientoweb.php";

  public idReferencia;

  public resultadoConsulta: any = [];

  public estado;
  public valorTransaccion;
  public dataTransaccion;
  public loading = false;
  public codigo;
  public cedula;
  constructor(
    private activatedRouter: ActivatedRoute,
    private global: GlobalService,
    private WebApiService: WebApiService
  ) {
    this.idReferencia = this.activatedRouter.snapshot.queryParams.id;
    this.ConsultarEstado();
    this.consultarPrecio();
  }

  ngOnInit() {}

  /**
    Metodo que nos permite consultar el estado de la transacción

   */
  ConsultarEstado() {
    let url = this.UrlWompi + "validarPago";
    this.global.postData(url, this.idReferencia).subscribe(
      (res) => {
        this.resultadoConsulta = res.data.data;

        if (this.resultadoConsulta.status == "APPROVED") {
          this.estado = "APROBADA";
        }
        if (this.resultadoConsulta.status == "DECLINED") {
          this.estado = "RECHAZADA";
        }
        if (this.resultadoConsulta.status == "VOIDED") {
          this.estado = "ANULADA";
        }
        if (this.resultadoConsulta.status == "PENDING") {
          this.estado = "PENDIENTE";
        }
        if (this.resultadoConsulta.status == "ERROR") {
          this.estado = "ERROR";
        }
        this.BuscarReferencia();
        this.ActualizarDatos();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  consultarPrecio() {
    let ruta = this.UrlWompi + "consultarValor";
    this.global.getPago(ruta).subscribe(
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

  BuscarReferencia() {
    let ruta = this.UrlWompi + "referencias";
    let referencia = this.resultadoConsulta.reference;
    this.global.viewData(ruta, referencia).subscribe(
      (res) => {
        this.dataTransaccion = res.resultado;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ActualizarDatos() {
    let ruta = this.UrlWompi + "referencias";

    let referencia = this.resultadoConsulta.reference;
    let data = {
      numero_transaccion: this.idReferencia,
      Estado_transaccion: this.resultadoConsulta.status,
      metodo_pago: this.resultadoConsulta.payment_method.type,
      tipo_pago: this.resultadoConsulta.payment_method_type,
    };

    this.global.updateData(ruta, referencia, data).subscribe(
      (res) => {
        this.cedula = res.data[0].numero_identificacion;
        let data = 202209;

        this.WebApiService.getDt(
          this.urlFacturacion,

          {
            accion: "getTerceroCodigo",
            cedula: data,
          }
        ).subscribe(
          (res) => {
            console.log(res);
            this.codigo = res.datos.retorno[0].tercero_codigo;
            this.generarFacturacion();
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  generarFacturacion() {
    this.WebApiService.getDt(
      this.urlFacturacion,

      {
        accion: "getTerceroCodigo",
        cedula: this.cedula,
      }
    ).subscribe(
      (res) => {
        console.log(res);
        this.codigo = res.datos.retorno[0].tercero_codigo;
      },
      (err) => {
        console.log(err.success);
      }
    );



    let date = new Date();
    let day;
    let dayAux = date.getDate();
    if (dayAux<10) {
      day=`0${dayAux}`
    } else {
      day=`${dayAux}`
    }
    let month
    let monthAux = date.getMonth() + 1;

     if (monthAux<10) {
      month=`0${monthAux}`
    } else {
      month=`${monthAux}`
    }
    let year = date.getFullYear();

    var nueva_fecha = new Date();

    nueva_fecha.setDate(date.getDate() + 3);

  let dayS;
    let daySuma = nueva_fecha.getDate();

     if (daySuma<10) {
      dayS=`0${daySuma}`
    } else {
      dayS=`${daySuma}`
    }
    let mes;
    let monthSuma = nueva_fecha.getMonth() + 1;

     if (monthSuma<10) {
      mes=`0${monthSuma}`
    } else {
      mes=`${monthSuma}`
    }



    let fechaInicio=`${day}/${month}/${year}`;
    let fechaFinal=`${dayS}/${mes}/${year}`;




   // console.log(fechaInicio);
   // console.log(fechaFinal);
    let data = {
      costo_pago: this.valorTransaccion,
      referencia: this.idReferencia,
      codigoTercero: this.codigo,
    };

    this.WebApiService.getDt(
      this.urlFacturacion,

      {
        accion: "getFactura",
        costo_pago: this.valorTransaccion,
        referencia: this.idReferencia,
        codigoTercero: this.codigo,
        fechaInicial: fechaInicio,
        fechaFinal: fechaFinal
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

  generarReporte() {
    this.loading = true;
    let ruta = this.UrlWompi + "generarReporte";
    console.log(this.dataTransaccion);
    let data = { email: this.dataTransaccion[0].email };

    this.global.postData(ruta, data).subscribe(
      (res) => {
        console.log(res);
        this.loading = false;
        swal.fire(
          "",
          "Se ha enviado al correo el reporte del vehiculo",
          "success"
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
