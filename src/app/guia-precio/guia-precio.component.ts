import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ValoradorService } from "../servicios/valorador.service";
import { MatStepper } from "@angular/material";
import { MatSnackBar } from "@angular/material/snack-bar";
import { WebApiService } from "src/app/servicios/web-api.service";
import { PageEvent } from "@angular/material/paginator";

import { AppComponent } from "src/app/app.component";
import swal from "sweetalert2";

import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { GlobalService } from "../servicios/global.service";

import { BreakpointObserver } from "@angular/cdk/layout";
import { MatSidenav } from "@angular/material/sidenav";
import { delay } from "rxjs/operators";
declare var EXIF: any;

export interface marca {
  nombre: string;
}

@Component({
  selector: "app-guia-precio",
  templateUrl: "./guia-precio.component.html",
  styleUrls: ["./guia-precio.component.css"],
})
export class GuiaPrecioComponent implements OnInit {
  public urlFiltros = "http://api.libroazul.com.co/vehiculos/";
  public urlPrecios = "http://api.libroazul.com.co/guiaPrecios/precios";

  public listClases: any = [];
  public listMarcas: any = [];
  public listFamilias: any = [];
  public listCajaTipo: any = [];
  public listLineas: any = [];

  public listPrecio: any = [];

  public familiasSeleccion: any = [];

  public listPrecios: any = [];

  public caja = 0;
  public CodigoAux: any = [];
  public newJson: any = [];
  public ciudadesNo: any = [];

  public position = 0;
  public encontrado = false;


  public listAnoNuevo:any =[];
  public listAnoUsados:any =[];
  public cantAnosUsuados:0;

  page_size: number = 10; // CANTIDAD DE ELEMENTOS POR PAGINA
  page_number: number = 1;
  pageSizeOptions = [5, 10, 20, 50, 100];
  constructor(
    private WebApiService: WebApiService,
    private _valoradorService: ValoradorService,
    private _globalService: GlobalService,
    private observer: BreakpointObserver
  ) {}

  ngOnInit() {
    this.getClase();
    this.getMarca();
    this.obtenerPrecio();
  }
  handlePage(e: PageEvent) {
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }

  getClase() {
    this._globalService.getData(this.urlFiltros + "clases").subscribe(
      (res) => {
        this.listClases = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this._globalService.getData(this.urlFiltros + "caja").subscribe(
      (res) => {
        this.listCajaTipo = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getMarca() {
    this._globalService
      .getData(this.urlFiltros + "marcas?clase=" + 1)
      .subscribe(
        (res) => {
          this.listMarcas = res;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getDataFilter(key, event, dta) {
    let data = event.source.value;

    switch (key) {
      case "marca":
        this._globalService
          .getData(this.urlFiltros + "marcas?clase=" + data)
          .subscribe(
            (res) => {
              this.listMarcas = [];
              this.listMarcas = res;
            },
            (err) => {
              console.log(err);
            }
          );

        break;

      case "familia":
        for (let index = 0; index < this.listFamilias.length; index++) {
          const element = this.listFamilias[index];
          if (element.id == dta.id) {
            this.position = index;
            this.encontrado = true;
          }
        }
        if (this.encontrado) {
          this.listFamilias.splice(this.position, 1);
          this.position = 0;
          this.encontrado = false;
        } else {
          this._globalService
            .getData(this.urlFiltros + "familias?marca=" + data)
            .subscribe(
              (res) => {
                console.log(res);
                let array = {
                  id: dta.id,
                  nombre: dta.nombre,
                  data: res,
                };

                this.listFamilias.push(array);
              },
              (err) => {
                console.log(err);
              }
            );
        }

        break;

      case "caja":
        this.caja = data;

        this.listLineas = [];
        for (let index = 0; index < this.listFamilias.length; index++) {
          const element = this.listFamilias[index];
          const familia = this.familiasSeleccion[index];

          this._globalService
            .getData(
              this.urlFiltros +
                "lineas?marca=" +
                element.id +
                "&familia=" +
                familia +
                "&caja_cambios=" +
                this.caja
            )
            .subscribe(
              (res) => {
                let array = {
                  id: familia,
                  nombre: element.nombre,
                  data: res,
                };

                this.listLineas.push(array);
              },
              (err) => {
                console.log(err);
              }
            );
        }

        break;

      case "linea":
        for (let index = 0; index < this.listLineas.length; index++) {
          const element = this.listLineas[index];
          if (element.id == data) {
            this.position = index;
            this.encontrado = true;
          }
        }
        if (this.encontrado) {
          this.listLineas.splice(this.position, 1);
          this.familiasSeleccion.splice(this.position, 1);
          this.position = 0;
          this.encontrado = false;
        } else {
          this._globalService
            .getData(
              this.urlFiltros + "lineas?marca=" + dta.id + "&familia=" + data
            )
            .subscribe(
              (res) => {
                let array = {
                  id: data,
                  nombre: dta.nombre,
                  marca: dta.id,
                  familia: data,
                  data: res,
                };

                this.familiasSeleccion.push(data);
                this.listLineas.push(array);
              },
              (err) => {
                console.log(err);
              }
            );
        }

        break;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // ───────────────────────────Metodos para obtener los precios
  // ────────────────────────────────────────────────────────────────────────────────

  obtenerPrecio() {
    this._globalService.getData(this.urlPrecios).subscribe(
      (res) => {
       console.log(res);
        this.listPrecios = res;
        this.listAnoNuevo=res[0].lista_nuevo;
        this.listAnoUsados=res[0].lista_usado;
        this.cantAnosUsuados=this.listAnoUsados.length;
       

      },
      (err) => {
        console.log(err);
      }
    );
  }
}
