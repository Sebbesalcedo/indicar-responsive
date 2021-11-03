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
  public listTraccion: any = [];
  public listForma: any = [];
  public listTipoMotor: any = [];
  public listTipoServicio: any = [];
  public listSegmento: any = [];
  public listEquipamento: any = [];

  public listPrecio: any = [];

  public familiasSeleccion: any = [];

  public listPrecios: any = [];

  public caja = 0;
  public CodigoAux: any = [];
  public newJson: any = [];
  public ciudadesNo: any = [];

  public position = 0;
  public encontrado = false;

  public listAnoNuevo: any = [];
  public listAnoUsados: any = [];
  public cantAnosUsuados: 0;

  public basica: Boolean = false;

  public avanzada: Boolean = false;
  public profesional: Boolean = false;

  public marca;
  public familia;

  public linea;

  public dataFiltro: any = [];
  public filterData: any = [];

  public generateUrl: any = [];
  public urlGenerada: any = [];

  page_size: number = 50; // CANTIDAD DE ELEMENTOS POR PAGINA
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

    this._globalService.getData(this.urlFiltros + "traccion").subscribe(
      (res) => {
        this.listTraccion = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this._globalService.getData(this.urlFiltros + "formas").subscribe(
      (res) => {
        this.listForma = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this._globalService.getData(this.urlFiltros + "segmento").subscribe(
      (res) => {
        this.listSegmento = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this._globalService.getData(this.urlFiltros + "tipomotor").subscribe(
      (res) => {
        this.listTipoMotor = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this._globalService.getData(this.urlFiltros + "tiposervicio").subscribe(
      (res) => {
        this.listTipoServicio = res;
      },
      (err) => {
        console.log(err);
      }
    );

    this._globalService.getData(this.urlFiltros + "equipamiento").subscribe(
      (res) => {
        this.listEquipamento = res;
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

  tipoBusqueda(event) {
    let data = parseInt(event.value);
    switch (data) {
      case 1:
        this.basica = true;
        this.avanzada = false;
        this.profesional = false;

        break;

      case 2:
        this.avanzada = true;
        this.profesional = false;

        break;
      case 3:
        this.avanzada = false;
        this.profesional = true;

        break;
    }
  }

  getDataFilter(key, event, dta) {
    let data = event.source.value;

    switch (key) {
      // Al seleccionar una clase se cargan las marcas
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
      // al seleccionar una marca se cargue la lista de familia
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
          //para la lista de precios
          this._globalService
            .getData(this.urlPrecios + "?marca=" + data)
            .subscribe(
              (res) => {
                //Eliminamos los datos de inicio
                for (let index = 0; index < this.listPrecios.length; index++) {
                  const element = this.listPrecios[index];

                  if (element.id === 199703) {
                    this.listPrecios = [];
                  }
                }

                let precios = {
                  id: parseInt(data),
                  data: res,
                };

                if (this.listPrecios == null) {
                  this.listPrecios.push(precios);
                } else {
                  for (
                    let index = 0;
                    index < this.listPrecios.length;
                    index++
                  ) {
                    const element = this.listPrecios[index];
                    if (element.id === parseInt(data)) {
                      this.listPrecios.splice(index, 1);
                      console.log("object");
                    
                    } else {
                      this.listPrecios.push(precios);
                      console.log("1234object");
                    }
                  }
                }
              },
              (err) => {
                console.log(err);
              }
            );
        }

        break;
      case "linea":
        console.log(this.listPrecios);
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

          for (let index = 0; index < this.listPrecios.length; index++) {
            const element = this.listPrecios[index];
            console.log(element);
            if (element.id == dta.id) {
            
              this.position = index;
              this.encontrado = true;
            }
          }
          if (this.encontrado) {
            this.listPrecios.splice(this.position, 1);
            console.log( this.listPrecios);
            
          } else {

               //para la lista de precios
          this._globalService
            .getData(this.urlPrecios + "?marca=" + dta.id + "&familia=" + data)
            .subscribe(
              (res) => {
                let precios = {
                  id: dta.id,
                  data: res,
                };

                this.listPrecios.push(precios);
              },
              (err) => {
                console.log(err);
              }
            );

          }
         
        }

        break;

      case "precioLinea":
        //para la lista de precios
        this._globalService
          .getData(this.urlPrecios + "?linea=" + data)
          .subscribe(
            (res) => {
              for (let index = 0; index < this.listPrecios.length; index++) {
                const element = this.listPrecios[index];
                console.log(element.id, res[0].linea);
                if (
                  element.id === res[0].linea ||
                  element.id === res[0].marca
                ) {
                  this.listPrecios.splice(index, 1);
                }
              }

              console.log(this.listPrecios);

              console.log(res);
              let precios = {
                id: data,
                data: res,
              };

              this.listPrecios.push(precios);
            },
            (err) => {
              console.log(err);
            }
          );

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
    }
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // ───────────────────────────Metodos para obtener los precios
  // ────────────────────────────────────────────────────────────────────────────────

  getFilter() {
    for (let index = 0; index < this.generateUrl.length; index++) {
      const element = this.generateUrl[index];
    }
  }

  obtenerPrecio() {
    this._globalService.getData(this.urlPrecios).subscribe(
      (res) => {
        let usado = {
          linea: 0,
          data: res[0].lista_usado,
        };
        let nuevo = {
          linea: 0,
          data: res[0].lista_nuevo,
        };

        let precios = {
          id: 199703,
          data: res,
        };

        this.listPrecios.push(precios);
        this.listAnoNuevo = res[0].lista_nuevo;
        this.listAnoUsados = res[0].lista_usado;

        this.cantAnosUsuados = this.listAnoUsados.length;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // ────────────────────────────────────────────────────────────────────────────────
  // ───────────────────────────Metodos para obtener los precios cpn los filtros
  // ────────────────────────────────────────────────────────────────────────────────

  obtenerFiltro() {
    let urlFinal;

    this._globalService.getData(this.urlPrecios).subscribe(
      (res) => {
        console.log(res);
        this.listPrecios = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
