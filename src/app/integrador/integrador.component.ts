import { Component, OnInit } from "@angular/core";
import { IntegradorService } from "../servicios/integrador.service";
import { AppComponent } from "src/app/app.component";
import Swal from "sweetalert2";
import { WebApiService } from "./../servicios/web-api.service";
import { Subscriber } from "rxjs";
@Component({
  selector: "app-integrador",
  templateUrl: "./integrador.component.html",
  styleUrls: ["./integrador.component.css"],
})
export class IntegradorComponent implements OnInit {
  public data: any;

  constructor(
    private _integrador: IntegradorService,
    private _data: WebApiService
  ) {}

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
          var redirect = urlParams.get("redirect");
          var anuncioParam = urlParams.get("state");
          var user = urlParams.get("codigo");
          //console.log(queryString);
          //Mostramos los valores en consola:

          let dt = {
            appid: "221094036941020",

            state: anuncioParam,
            redirect: redirect,

            // username: user,
          };
          //console.log(dt);

          this._data
            .postRequest(AppComponent.urlService, dt, { _p_action: "get_code" })
            .subscribe(
              (res) => {
                console.log(res);

                let data2 = {
                  action: "getToken",
                  code: res.data.code,
                  state: res.data.state,
                  portal: 1,
                };

                this._integrador
                  .postIntegrador("integrador/credenciales", data2, {})
                  .subscribe(
                    (resp) => {

                      Swal.fire({
                        title: "Vinculando tu cuenta...",
                        onBeforeOpen: () => {
                          Swal.showLoading();
                        },
                      });
                      if(resp.message=='Conexión exitosa..'){

                        location.href =        "https://integrador.processoft.com.co/integrador/cuentas";

                      }else{}
                    },
                    (error) => {
                      console.log(error);
                    }
                  );
              },
              (err) => {
                console.log(err);
              }
            );
        } else {
        }
      });
    } else {
    }
  }

  // updateToken(dtToken) {
  //   this._integrador
  //     .postsIntegrador("integrador/credenciales", dtToken, {})
  //     .subscribe(
  //       (resp) => {

  //         console.log(resp);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // }
}
