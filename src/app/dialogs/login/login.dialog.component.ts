import { Component, Inject, Output, EventEmitter } from "@angular/core";
//servicios
import { AuthenticationService } from "src/app/servicios/authentication-service.service";

// dependencias
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import swal from "sweetalert2";
import { Router } from "@angular/router";

export interface DialogData {
  window: string;
}

@Component({
  selector: "login-dialog",
  templateUrl: "login.dialog.html",
})
export class LoginDialog {
  // VARIABLES
  formLogin: any;
  formRegister1: any;
  formRegister2: any;
  formRecovery: any;
  formRecoveryPassword: any;
  // Login o Register
  view: string;
  isConcesionario: string = "01";
  error: string = "";
  emailInvalid: string = "";
  // mask
  public mask = "(000) 000 0000";

  inputTypeRegister: string = "password";
  inputTypeLogin: string = "password";
  passRecoveryType = "password";
  passConfirmRecoveryType = "password";

  // OUTPUT
  @Output() updateLoggedStatus = new EventEmitter();
  @Output() setFavorite = new EventEmitter();
  @Output() loading = new EventEmitter();
  @Output() recovery = new EventEmitter();
  @Output() putPassword = new EventEmitter();
  // @Output() validateEmail       = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    private AutheticationService: AuthenticationService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    //login or register
    this.view = this.data.window;

    switch (this.view) {
      case "login":
        //  LOGIN
        this.formLogin = new FormGroup({
          fcorreo: new FormControl("", [
            Validators.required,
            Validators.email,
            Validators.maxLength(150),
          ]),
          fpass: new FormControl("", [Validators.required]),
        });
        break;
      case "register":
        //  REGISTRO
        //registro cliente
        this.formRegister1 = new FormGroup({
          fcorreo: new FormControl("", [
            Validators.required,
            Validators.email,
            Validators.maxLength(150),
          ]),
          ftiporegistro: new FormControl("01"),
        });
        //registro juridico
        this.formRegister2 = new FormGroup({
          fname: new FormControl("", [
            Validators.required,
            Validators.maxLength(100),
          ]),
          flname: new FormControl("", [
            Validators.required,
            Validators.maxLength(100),
          ]),
          fphone1: new FormControl("", [
            Validators.required,
            Validators.maxLength(15),
          ]),
          fpass1: new FormControl("", [Validators.required]),
          fcpass1: new FormControl("", [Validators.required]),
          fterm1: new FormControl(false, [Validators.required]),
          frazonsocial: new FormControl("", [
            Validators.required,
            Validators.maxLength(150),
          ]),
          fnit: new FormControl("", [
            Validators.required,
            Validators.maxLength(20),
          ]),
          faddress: new FormControl("", [
            Validators.required,
            Validators.maxLength(200),
          ]),
          fphone2: new FormControl("", [
            Validators.required,
            Validators.maxLength(15),
          ]),
          fpass2: new FormControl("", [Validators.required]),
          fcpass2: new FormControl("", [Validators.required]),
          fterm2: new FormControl(false, [Validators.required]),
        });
        break;
      case "recoveryPassword":
        // RECUPERAR CONTRASEÑA CON TOKEN
        this.formRecoveryPassword = new FormGroup({
          fpass: new FormControl("", [Validators.required]),
          fcpass: new FormControl("", [Validators.required]),
        });
        this.passRecoveryType = "password";
        this.passConfirmRecoveryType = "password";
        break;
    }
  }

  /**
   * @description   Metodo usado para chequear el email existe en la base de dato de indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @return        true | false
   */
  checkEmail(event) {
    if (this.formRegister1.valid) {
      this.emailInvalid = "";
      if (event.target.value != "") {
        this.AutheticationService.checkEmail(event.target.value).subscribe(
          (data) => {
            let datos;
            datos = data;
            if (datos.cantidad == 1) {
              this.emailInvalid =
                "E-mail ya registrado por favor inicie sesión";
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    } else {
      this.emailInvalid = "Ingrese un correo valido";
    }
    this.validateEmailSintaxisRegister(event);
  }

  /**
   * @description   Metodo usado para verificar las sintaxis de los correos
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         04-02-2020
   * @return        true | false
   */
  validateEmailSintaxisLogin(e) {
    let fieldEmail;
    fieldEmail = document.querySelector("#mailLogin");
    let valid = this.validateEmailSintaxis(e.target.value);
    if (valid) {
      fieldEmail.classList.remove("mat-form-field-invalid");
    } else {
      fieldEmail.classList.add("mat-form-field-invalid");
    }
  }

  /**
   * @description   Metodo usado para verificar las sintaxis de los correos
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         04-02-2020
   * @return        true | false
   */
  validateEmailSintaxisRegister(e) {
    let fieldEmail;
    fieldEmail = document.querySelector("#mailRegister");
    let valid = this.validateEmailSintaxis(e.target.value);
    if (valid) {
      fieldEmail.classList.remove("mat-form-field-invalid");
    } else {
      fieldEmail.classList.add("mat-form-field-invalid");
    }
  }

  /**
   * @description   Metodo usado para verificar las sintaxis de los correos
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         04-02-2020
   * @return        true | false
   */
  validateEmailSintaxis(email) {
    let valid;
    if (email.search("@") != -1) {
      let dominio = email.split("@");
      let dotPosition = dominio[1].indexOf(".");
      if (dotPosition == -1) {
        valid = false;
      } else {
        valid = dominio[1].substr(dotPosition + 1).length > 1;
      }
    } else {
      valid = false;
    }
    return valid;
  }

  /**
   * @description   Metodo usado para cambiar el formulario de registro (concesionario o persona natural).
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @return        true | false
   */
  changeTipoCuenta() {
    if (this.formRegister1.get("ftiporegistro").value == "02") {
      this.isConcesionario = "02";
    } else {
      this.isConcesionario = "01";
    }
  }

  /**
   * @description   Metodo usado para loguear usuario en indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         28-11-2019
   */
  onSubmitLogin(register: boolean = null) {

    console.log(this.formLogin);
    let username = this.formLogin.value.fcorreo;
    let password = this.formLogin.value.fpass;
    this.loading.emit(true);


    this.AutheticationService.login(username, password).subscribe(
      (data) => {
        console.log(data);
        let datos;
        datos = data;
        if (datos.hasOwnProperty("success")) {
          if (datos.success == "true") {
            this.AutheticationService.setToken(datos.token);
            data["username"] = username;
            this.setearLocalStorage(data);
            //compruebo si hay pendiente de favorito
            let setFavorite = JSON.parse(localStorage.getItem("setFavorite"));
            if (setFavorite != null) {
              // establecer clasificado como favorito.
              this.setFavorite.emit(true);
            }
          } else {
            swal.fire({
              title: "",
              text: "Usuario o password incorrectos",
              icon: null,
            });
            this.loading.emit(false);
          }
        }
      },
      (error) => {
        console.log(error);

        swal.fire({
          title: "",
          text: "Usuario o password incorrectos",
          icon: null,
        });
        this.updateLoggedStatus.emit(false);
      }
    );
  }
  /**
   * @description   Metodo usado para establecer variables de local storage.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         28-11-2019
   */
  setearLocalStorage(data) {
    let datos;
    datos = data;
    if (datos.token) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          token: datos.token,
          codigo: datos.codigo,
          name: datos.name,
          username: datos.username,
          telefono: datos.p_telefonocelular,
          tipocliente: datos.tipocliente,
          clienteimagen: datos.p_clienteimagen,
          ciudad_codigo: datos.p_ciudad_codigo,
          ciudad_nombre: datos.p_ciudad_nombre,
          tipoasesor: datos.tipoasesor,
        })
      );
      this.updateLoggedStatus.emit(datos);
    }
  }

  /**
   * @description   Metodo usado para loguear usuario en indicar.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         27-11-2019
   * @param         username usario del cliente
   * @param         pass contraseña del cliente
   * @return        true | false
   */
  onSubmitRegister() {
    // Persona Natural
    if (this.isConcesionario == "01") {
      // elimino validaciones.
      this.formRegister2.controls["frazonsocial"].clearValidators();
      this.formRegister2.controls["fnit"].clearValidators();
      this.formRegister2.controls["faddress"].clearValidators();
      this.formRegister2.controls["fphone2"].clearValidators();
      this.formRegister2.controls["fpass2"].clearValidators();
      this.formRegister2.controls["fcpass2"].clearValidators();
      this.formRegister2.controls["fterm2"].clearValidators();
      // asigno valores
      this.formRegister2.get("frazonsocial").setValue("");
      this.formRegister2.get("fnit").setValue("");
      this.formRegister2.get("faddress").setValue("");
      this.formRegister2.get("fphone2").setValue("");
      this.formRegister2.get("fpass2").setValue("");
      this.formRegister2.get("fcpass2").setValue("");
      this.formRegister2.get("fterm2").setValue("");
    } else {
      // Concesionario
      // elimino validaciones.
      this.formRegister2.controls["fname"].clearValidators();
      this.formRegister2.controls["flname"].clearValidators();
      this.formRegister2.controls["fphone1"].clearValidators();
      this.formRegister2.controls["fpass1"].clearValidators();
      this.formRegister2.controls["fcpass1"].clearValidators();
      this.formRegister2.controls["fterm1"].clearValidators();
      // asigno valores
      this.formRegister2.get("fname").setValue("");
      this.formRegister2.get("flname").setValue("");
      this.formRegister2.get("fphone1").setValue("");
      this.formRegister2.get("fpass1").setValue("");
      this.formRegister2.get("fcpass1").setValue("");
      this.formRegister2.get("fterm1").setValue("");
    }
    // validacion de formulario
    if (!this.formRegister1.valid) {
      this.emailInvalid = "Ingrese un correo valido";
      return;
    }
    if (!this.validateEmailSintaxis(this.formRegister1.get("fcorreo").value)) {
      this.emailInvalid = "Ingrese un correo valido";
      return;
    }
    if (!this.formRegister2.valid) {
      this.error = "¡Debes completar la informacion solicitada!";
      return;
    } else {
      // identifico cual es el validador
      let pass,
        cpass,
        phone,
        term,
        fname,
        sname,
        flname,
        slname,
        direccion,
        nit,
        acepto;
      if (this.isConcesionario == "01") {
        // persona natural
        pass = "fpass1";
        cpass = "fcpass1";
        phone = "fphone1";
        term = "fterm1";
        fname = this.formRegister2.get("fname").value.trim().split(" ")[0];
        fname = fname.slice(0, 1).toUpperCase() + fname.slice(1).toLowerCase();
        sname = this.formRegister2.get("fname").value.split(" ")[1];
        if (sname != undefined) {
          sname =
            sname.slice(0, 1).toUpperCase() + sname.slice(1).toLowerCase();
        }
        flname = this.formRegister2.get("flname").value.trim().split(" ")[0];
        flname =
          flname.slice(0, 1).toUpperCase() + flname.slice(1).toLowerCase();
        slname = this.formRegister2.get("flname").value.split(" ")[1];
        if (slname != undefined) {
          slname =
            slname.slice(0, 1).toUpperCase() + slname.slice(1).toLowerCase();
        }

        if (sname == undefined || sname == null) {
          sname = "";
        }
        if (slname == undefined || slname == null) {
          slname = "";
        }
      } else {
        // concesionario
        pass = "fpass2";
        cpass = "fcpass2";
        phone = "fphone2";
        term = "fterm2";
        flname = "";
        slname = "";
        fname = "";
        sname = "";
      }
      if (
        this.formRegister2.get(pass).value !=
        this.formRegister2.get(cpass).value
      ) {
        this.error = "¡Las contraseñas no coinciden!";
        return;
      }
      if (this.formRegister2.get(term).value != true) {
        this.error = "¡Debes aceptar los avisos legales para poder continuar!";
        return;
      }

      this.error = "";
      this.loading.emit(true);
      // envio de datos al servidor.
      let data = {
        acepto: this.formRegister2.get(term).value,
        apellido1: flname,
        apellido2: slname,
        celular: this.formRegister2.get(phone).value,
        confirmarpassword: this.formRegister2.get(cpass).value,
        direccion: this.formRegister2.get("faddress").value,
        email: this.formRegister1.get("fcorreo").value.toLowerCase(),
        nit: this.formRegister2.get("fnit").value,
        nombre1: fname,
        nombre2: sname,
        password: this.formRegister2.get(pass).value,
        razonsocial: this.formRegister2.get("frazonsocial").value.toUpperCase(),
        tipocliente: this.isConcesionario,
      };

      this.AutheticationService.register(data).subscribe(
        (result) => {
          this.AutheticationService.login(data.email, data.password).subscribe(
            (response) => {
              let datos;
              datos = response;
              response["username"] = data.email;
              this.AutheticationService.setToken(datos.token);
              this.setearLocalStorage(response);
              this.updateLoggedStatus.emit(response);
              this.formLogin.value.fcorreo = data.email;
              this.formLogin.value.fpass = data.password;
              this.onSubmitLogin();
              this.router.navigate(['/usuario/(cuenta-opcion:cuenta)']);
            }
          );
        },
        (error) => {
          this.updateLoggedStatus.emit(error);
        }
      );
    }
  }

  viewPassRegister() {
    this.inputTypeRegister = "text";
  }
  hidePassRegister() {
    this.inputTypeRegister = "password";
  }
  viewPassLogin() {
    this.inputTypeLogin = "text";
  }
  hidePassLogin() {
    this.inputTypeLogin = "password";
  }

  onNoClick(): void {
    // this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }

  // closeDialogEnlace(link){
  //   event.stopPropagation();
  //   event.preventDefault();
  //   this.dialogRef.close();
  //   this.router.navigate([link]);
  // }

  // ############################################## CAMBIO SECCION REGISTRO ##############################################
  viewRegisterForm() {
    this.view = "register";
    //  REGISTRO
    //registro cliente
    this.formRegister1 = new FormGroup({
      fcorreo: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(150),
      ]),
      ftiporegistro: new FormControl("01"),
    });
    //registro juridico
    this.formRegister2 = new FormGroup({
      fname: new FormControl("", [
        Validators.required,
        Validators.maxLength(100),
      ]),
      flname: new FormControl("", [
        Validators.required,
        Validators.maxLength(100),
      ]),
      fphone1: new FormControl("", [
        Validators.required,
        Validators.maxLength(15),
      ]),
      fpass1: new FormControl("", [Validators.required]),
      fcpass1: new FormControl("", [Validators.required]),
      fterm1: new FormControl(false, [Validators.required]),
      frazonsocial: new FormControl("", [
        Validators.required,
        Validators.maxLength(150),
      ]),
      fnit: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
      ]),
      faddress: new FormControl("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
      fphone2: new FormControl("", [
        Validators.required,
        Validators.maxLength(15),
      ]),
      fpass2: new FormControl("", [Validators.required]),
      fcpass2: new FormControl("", [Validators.required]),
      fterm2: new FormControl(false, [Validators.required]),
    });
  }
  // ############################################## / CAMBIO SECCION REGISTRO ##############################################

  // ############################################## RECUPERACION DE CONTRASEÑAS ##############################################
  /**
   * @description   Metodo usado para crear el formulario de recuperacion y enviar token al correo.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         31-01-2020
   */
  passwordRecovery() {
    this.formRecovery = new FormGroup({
      fcorreo: new FormControl("", [Validators.required, Validators.email]),
    });
    this.view = "recovery";
  }

  /**
   * @description   Metodo usado para enviar correo con token para recuperacion.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         31-01-2020
   */
  onRecovery() {
    if (this.formRecovery.valid) {
      this.loading.emit(true);
      let body = {
        form: {
          email: this.formRecovery.get("fcorreo").value,
        },
      };
      this.recovery.emit(body);
      this.dialogRef.close();
    } else {
      swal.fire({
        title: "",
        icon: null,
        text: "Por favor ingresa un correo valido.",
      });
    }
  }

  /**
   * @description   Metodo usado para actualizar la contraseña en la db.
   * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version       1.0.0
   * @since         31-01-2020
   */
  onSubmitRecovery() {
    console.log("object");
    if (
      this.formRecoveryPassword.get("fpass").value !=
      this.formRecoveryPassword.get("fcpass").value
    ) {
      swal.fire({
        title: "",
        icon: null,
        text: "Por favor verifique sus contraseñas estas deben coincidir",
      });
    } else {
      this.loading.emit(true);
      let data = {
        password: this.formRecoveryPassword.get("fpass").value,
        confirmacionpassword: this.formRecoveryPassword.get("fcpass").value,
      };
      this.putPassword.emit(data);
    }
  }

  // ############################################## /Metodo de Google Analytics ##############################################
}
