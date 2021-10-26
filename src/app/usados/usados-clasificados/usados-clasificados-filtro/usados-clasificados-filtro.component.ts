import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  SimpleChange,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-usados-clasificados-filtro",
  templateUrl: "./usados-clasificados-filtro.component.html",
  styleUrls: ["./usados-clasificados-filtro.component.css"],
})
export class UsadosClasificadosFiltroComponent implements OnChanges {
  // VARIABLES
  filmar = false;
  filfam = false;
  fildep = false;
  filciu = false;
  verMarcas = true;
  verFamilia = true;
  verDepartamento = true;
  verCiudad = true;
  varUnicoDuenio = null;

  // inputs
  @Input() ftipoclasificado;
  @Input() fclase;
  @Input() fmarca;
  @Input() ffamilia;
  @Input() fdepartamento;
  @Input() fciudad;
  @Input() fprecio;
  @Input() fmodelo;
  @Input() fkm;
  @Input() ftraccion;
  @Input() fcaja;
  @Input() ftipomotor;
  @Input() fcapacidadmotor;
  @Input() funicoduenio;
  @Input() fplaca;
  @Input() fairbags;
  @Input() fcliente;
  // Output
  @Output() reload = new EventEmitter();
  @Output() filter = new EventEmitter();
  // filtro
  filtro = {
    ftipoclasificado: [],
    fclase: [],
    fmarca: [],
    ffamilia: [],
    fdepartamento: [],
    fciudad: [],
    fprecio: [],
    fmodelo: [],
    fkm: [],
    ftraccion: [],
    fcaja: [],
    ftipomotor: [],
    fcapacidadmotor: [],
    funicoduenio: [],
    fplaca: [],
    fairbags: [],
  };
  p_filtros = {
    p_cliente: "",
    p_tipoclasificado: "",
    p_clase: "",
    p_marca: "",
    p_familia: "",
    p_departamento: "",
    p_ciudad: "",
    p_precio: "",
    p_modelo: "",
    p_km: "",
    ftraccion: "",
    fcaja: "",
    ftipomotor: "",
    fcapacidadmotor: "",
    p_unico: "",
    p_placatermina: "",
    p_airbags: "",
    p_orderby: "",
  };

  constructor(private router: Router) {}

  ngOnChanges(filtros: SimpleChanges) {
    const ftipoclasificado: SimpleChange = filtros.ftipoclasificado;
    const fclase: SimpleChange = filtros.fclase;
    const fmarca: SimpleChange = filtros.fmarca;
    const ffamilia: SimpleChange = filtros.ffamilia;
    const fdepartamento: SimpleChange = filtros.fdepartamento;
    const fciudad: SimpleChange = filtros.fciudad;
    const fprecio: SimpleChange = filtros.fprecio;
    const fmodelo: SimpleChange = filtros.fmodelo;
    const fkm: SimpleChange = filtros.fkm;
    const ftraccion: SimpleChange = filtros.ftraccion;
    const fcaja: SimpleChange = filtros.fcaja;
    const ftipomotor: SimpleChange = filtros.ftipomotor;
    const fcapacidadmotor: SimpleChange = filtros.fcapacidadmotor;
    const funicoduenio: SimpleChange = filtros.funicoduenio;
    const fplaca: SimpleChange = filtros.fplaca;
    const fairbags: SimpleChange = filtros.fairbags;

    //valores obtenidos
    if (ftipoclasificado != undefined) {
      this.filtro.ftipoclasificado = ftipoclasificado.currentValue;
    }
    if (fclase != undefined) {
      this.filtro.fclase = fclase.currentValue;
    }
    if (fmarca != undefined) {
      this.filtro.fmarca = fmarca.currentValue;
    }
    if (ffamilia != undefined) {
      this.filtro.ffamilia = ffamilia.currentValue;
    }
    if (fdepartamento != undefined) {
      this.filtro.fdepartamento = fdepartamento.currentValue;
    }
    if (fciudad != undefined) {
      this.filtro.fciudad = fciudad.currentValue;
    }
    if (fprecio != undefined) {
      this.filtro.fprecio = fprecio.currentValue;
    }
    if (fmodelo != undefined) {
      this.filtro.fmodelo = fmodelo.currentValue;
    }
    if (fkm != undefined) {
      this.filtro.fkm = fkm.currentValue;
    }
    if (ftraccion != undefined) {
      this.filtro.ftraccion = ftraccion.currentValue;
    }
    if (fcaja != undefined) {
      this.filtro.fcaja = fcaja.currentValue;
    }
    if (ftipomotor != undefined) {
      this.filtro.ftipomotor = ftipomotor.currentValue;
    }
    if (fcapacidadmotor != undefined) {
      this.filtro.fcapacidadmotor = fcapacidadmotor.currentValue;
    }
    if (funicoduenio != undefined) {
      this.filtro.funicoduenio = funicoduenio.currentValue;
    }
    if (fplaca != undefined) {
      this.filtro.fplaca = fplaca.currentValue;
    }
    if (fairbags != undefined) {
      this.filtro.fairbags = fairbags.currentValue;
    }
  }

  changes() {
    // this.change.emit()
    this.p_filtros.p_cliente = this.fcliente;
    this.p_filtros.p_tipoclasificado = "";
    this.p_filtros.p_clase = "";
    this.p_filtros.p_marca = "";
    this.p_filtros.p_familia = "";
    this.p_filtros.p_departamento = "";
    this.p_filtros.p_ciudad = "";
    this.p_filtros.p_precio = "";
    this.p_filtros.p_modelo = "";
    this.p_filtros.p_km = "";
    // this.p_filtros.ftraccion          = "";
    // this.p_filtros.fcaja              = "";
    // this.p_filtros.ftipomotor         = "";
    // this.p_filtros.fcapacidadmotor    = "";
    this.p_filtros.p_unico = "";
    this.p_filtros.p_placatermina = "";
    this.p_filtros.p_airbags = "";

    // mapeo de  tipo clasificado
    this.filtro.ftipoclasificado.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_tipoclasificado == "") {
          this.p_filtros.p_tipoclasificado += item.codigo;
        } else {
          this.p_filtros.p_tipoclasificado += "," + item.codigo;
        }
      }
    });
    // mapeo de clase
    this.filtro.fclase.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_clase == "") {
          this.p_filtros.p_clase += item.codigo;
        } else {
          this.p_filtros.p_clase += "," + item.codigo;
        }
      }
    });
    // mapeo de marca
    this.filtro.fmarca.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_marca == "") {
          this.p_filtros.p_marca += item.codigo;
        } else {
          this.p_filtros.p_marca += "," + item.codigo;
        }
      }
    });
    // mapeo de familia
    this.filtro.ffamilia.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_familia == "") {
          this.p_filtros.p_familia += item.codigo;
        } else {
          this.p_filtros.p_familia += "," + item.codigo;
        }
      }
    });
    // mapeo de departamento
    this.filtro.fdepartamento.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_departamento == "") {
          this.p_filtros.p_departamento += item.codigo;
        } else {
          this.p_filtros.p_departamento += "," + item.codigo;
        }
      }
    });
    // mapeo de ciudad
    this.filtro.fciudad.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_ciudad == "") {
          this.p_filtros.p_ciudad += item.codigo;
        } else {
          this.p_filtros.p_ciudad += "," + item.codigo;
        }
      }
    });
    // Seteo de unico duenio
    if (this.varUnicoDuenio) {
      this.p_filtros.p_unico = "S";
    } else {
      this.p_filtros.p_unico = "";
    }
    // mapeo de placa termina
    this.filtro.fplaca.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_placatermina == "") {
          this.p_filtros.p_placatermina += item.codigo;
        } else {
          this.p_filtros.p_placatermina += "," + item.codigo;
        }
      }
    });
    // mapeo de airbags
    this.filtro.fairbags.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_airbags == "") {
          this.p_filtros.p_airbags += item.codigo;
        } else {
          this.p_filtros.p_airbags += "," + item.codigo;
        }
      }
    });
    // mapeo de PRECIO
    this.filtro.fprecio.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_precio == "") {
          this.p_filtros.p_precio += item.codigo;
        } else {
          this.p_filtros.p_precio += "," + item.codigo;
        }
      }
    });

    this.filtro.fmodelo.map((item) => {
      if (item.selected) {
       // console.log(item);
        if (this.p_filtros.p_modelo == "") {
          this.p_filtros.p_modelo += item.codigo;
        } else {
          this.p_filtros.p_modelo += "," + item.codigo;
        }
      }
    });

    this.filtro.fkm.map((item) => {
      if (item.selected) {
        if (this.p_filtros.p_km == "") {
          this.p_filtros.p_km += item.codigo;
        } else {
          this.p_filtros.p_km += "," + item.codigo;
        }
      }
    });
 // console.log(this.p_filtros);
    // this.router.navigate(["/clasificados"], { queryParams: this.p_filtros });
    this.reload.emit(this.p_filtros);
  }

  deselectAll() {
    let filtros = {};
    this.reload.emit(filtros);
  }

  closeFilter() {
    this.filter.emit("close");
  }
}
