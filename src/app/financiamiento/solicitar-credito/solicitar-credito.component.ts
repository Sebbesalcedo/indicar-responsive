import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
// SERVICIOS
import { WebApiService } from 'src/app/servicios/web-api.service';
// DEPENDENCIAS
import swal from 'sweetalert2';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-solicitar-credito',
  templateUrl: './solicitar-credito.component.html',
  styleUrls: ['./solicitar-credito.component.css']
})
export class SolicitarCreditoComponent implements OnInit {

  // VARIABLES
  ciudadesUbicacion:any   = [];
  ciudades:any            = [];
  perfiles:any            = [];
  financiera:any          = [];
  cuser:any               = null;
  // FORMULARIO
  formSolicitarCredito:any;
  // MASK
  public maskphone = "(000) 000 0000";
  constructor(
    private WebApiService:WebApiService,
    public snackBar: MatSnackBar
  ){ }

  ngOnInit() {
    this.cuser = JSON.parse(localStorage.getItem('currentUser'));
    this.initForm();
    this.sendRequest();
  }

  initForm(){
    this.formSolicitarCredito = new FormGroup({
      fname:    new FormControl('',Validators.required),
      fperfil:  new FormControl('',Validators.required),
      fphone:   new FormControl('',Validators.required),
      fciudad:  new FormControl('',Validators.required),
      fcorreo:  new FormControl('',[Validators.required,Validators.email]),
      frcorreo: new FormControl('',[Validators.required,Validators.email]),
    })
    if(this.cuser != null){
      this.formSolicitarCredito.get('fname').setValue(this.cuser.name);
      this.formSolicitarCredito.get('fcorreo').setValue(this.cuser.username);
      this.formSolicitarCredito.get('fphone').setValue(this.cuser.telefono);
    }
  }

  sendRequest(){
    // CIUDADES
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action:'_getLovs',
      p_lov:  '_LOVCIUDADES'
    })
    .subscribe(
      data=>{
        this.ciudades           = data.datos;
        this.ciudadesUbicacion  = data.datos;
        window.scrollTo(0,0);
      },
      error=>{
        console.log(error);
      }
    );
    // PERFILES
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action:'_getLovs',
      p_lov:  '_LOVTIPOPERFIL'
    })
    .subscribe(
      data=>{
        this.perfiles           = data.datos;
        window.scrollTo(0,0);
      },
      error=>{
        console.log(error);
      }
    );
    //FINANCIERAS    
    this.WebApiService.getRequest(AppComponent.urlService,{
      _p_action:'_getLovs',
      p_lov: '_LOVFINANCIERAS'
    })
    .subscribe(
      data=>{
        this.financiera = data.datos;
      },
      error=>{
        console.log(error);
      }
    )

    // this.promiseService.getServiceWithComplexObjectAsQueryString(
    //     AppComponent.urlservicio + '?_p_action=_getLovs',
    //     {
    //         p_lov: '_LOVFINANCIERAS'
    //     }
    // )
    //     .then(result => {
    //         this.lovFinancieras = result.datos;
    //         console.log("FIN",this.lovFinancieras);
    //     })
    //     .catch(error => console.log(error));   
  }


  // AUTOCOMPLETE FILTER MATRICULA.
  filterOptions(e){
    let write = e.target.value;
    this.ciudadesUbicacion = this.ciudades.filter(ubicacion =>{
      return ubicacion.ciudad_nombre.search(write.toUpperCase()) != -1;
    });
  }
  
  displayFn(ciudad?:any): string | undefined {
    return ciudad ? ciudad.ciudad_nombre : undefined;
  }

  /**
   * @author          Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
   * @version         1.0.1
   * @since           02-01-2020
   * @description     Metodo usado para validar la ubicacion cuando no se selecciona de la lista de autocompletado
   */
  validateUbicacion(){
    if(typeof(this.formSolicitarCredito.get('fciudad').value) != "object"){
      this.formSolicitarCredito.get('fciudad').setValue('');
    }
  }


  onSubmit(financiera){
    if(this.formSolicitarCredito.invalid){
      swal.fire({
        title: '',
        icon: null,
        text: 'Debe completar el formulario correctamente'
      })
    }else if(this.formSolicitarCredito.get('fcorreo').value != this.formSolicitarCredito.get('frcorreo').value){
      swal.fire({
        title: '',
        icon: null,
        text: 'Los e-mails deben coincidir'
      })
    }else{
      let data = {
        ciudad_residencia: this.formSolicitarCredito.get('fciudad').value,
        email: this.formSolicitarCredito.get('fcorreo').value,
        email_confirmacion: this.formSolicitarCredito.get('frcorreo').value,
        nombre: this.formSolicitarCredito.get('fname').value,
        perfil: this.formSolicitarCredito.get('fperfil').value,
        telefono: this.formSolicitarCredito.get('fphone').value
      }
      let body = {
        form_solicitud: data,
        p_financiera: financiera
      }
      this.WebApiService.postRequest(AppComponent.urlService,body,{
        _p_action:'_solicitudesCredito2'
      })
      .subscribe(
        data=>{
          this.snackBar.open('Información actualizada','Aceptar',{
            duration:3000
          });
          if(financiera=='4'){
            swal.fire({
                text: "¡Será dirigido a la pagina de Colpatria para terminar el proceso!",
                icon: null,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok',
                cancelButtonText: 'Cancelar',
              }).then((result) => {
                if (result.value) {
                    window.open(this.financiera[0].financiera_urllead);
                }
              })                  
          }else{
            this.snackBar.open('Información actualizada',null,{
              duration:3000
            });
          }
        },
        error=>{
          this.snackBar.open('Error al actualizar',null,{
            duration:3000
          });
          console.log(error);
        }
      )
    }
  }
}
