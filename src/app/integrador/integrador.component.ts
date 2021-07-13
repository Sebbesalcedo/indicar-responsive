import { Component, OnInit } from "@angular/core";
import { IntegradorService } from "../servicios/integrador.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-integrador",
  templateUrl: "./integrador.component.html",
  styleUrls: ["./integrador.component.css"],
})
export class IntegradorComponent implements OnInit {
  public data: any;

  constructor(private _integrador: IntegradorService) {}

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem("currentUser"));

    this.validacion();
  }

  validacion() {
    if (this.data) {
      Swal.fire({
        imageUrl: "../../../assets/images/authorization-2.jpg",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vincular",
        cancelButtonText: " Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          var queryString = window.location.search;
          var urlParams = new URLSearchParams(queryString);
          var anuncioParam = urlParams.get("state");

          //Mostramos los valores en consola:
          console.log(anuncioParam);

          let dt = {
            token: this.data.token,
            code: this.data.codigo,
            state: anuncioParam,
            action: "generateState",
            portal: 1,
            user: 89,
            // username: user,
          };

          let sDt = {
            accessToken: this.data.token,
            code: this.data.codigo,
            state: anuncioParam,
            action: "getToken",
            portal: 1,

            // username: user,
          };

          this._integrador
            .postIntegrador("integrador/credenciales", dt, {})
            .subscribe(
              (res) => {
                console.log(res);

                this._integrador
                  .postIntegrador("integrador/credenciales", sDt, {})
                  .subscribe(
                    (res) => {
                      console.log(res);
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

          // Swal.fire({
          //   title: "Vinculando tu cuenta...",
          //   onBeforeOpen: () => {
          //     Swal.showLoading();
          //   },
          // });
          // location.href="https://integrador.processoft.com.co/integrador/cuentas";
        } else {
        }
      });
    } else {
    }
  }
}
