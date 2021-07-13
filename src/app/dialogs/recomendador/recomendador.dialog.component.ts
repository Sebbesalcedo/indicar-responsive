import { Component, Inject, Output, EventEmitter } from '@angular/core';
// dependencias
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

// SERVICIOS
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AuthenticationService } from 'src/app/servicios/authentication-service.service';
import { AppComponent } from 'src/app/app.component';

export interface DialogData {
  login: boolean;
}

@Component({
  selector: 'recomendador-dialog',
  templateUrl: 'recomendador.dialog.html',
})

export class RecomendadorDialog{
    // VARIABLES
    formRecomendador:any;

    minPrice:number         = null;
    maxPrice:number         = null;
    constMaxYear:number     = null;
    constMinYear:number     = null;
    maxYear:number          = null;
    minYear:number          = null;

    hide:boolean            = true;
    hideConfirm:boolean     = true;
    viewCorreo:boolean      = false;
    viewPass:boolean        = false;
    viewPhone:boolean       = false;
    viewAsesor:boolean      = false;
    emailInvalid:string     = '';
    opt;

     // mask
    public maskPhone = "(000) 000 0000";


    beneficiosSelected = [];
    categoriaBeneficios = [];
    //   'Get up',
    //   'Brush teeth',
    //   'Take a shower',
    //   'Check e-mail',
    //   'Walk dog'
    // ];
    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
      }
    }



    // OUTPUT
    @Output() loading = new EventEmitter();
  
    constructor(
        public dialogRef: MatDialogRef<RecomendadorDialog>,
        @Inject(MAT_DIALOG_DATA) public data:any,
        private WebApiService:WebApiService,
        private snackBar:MatSnackBar,
        private router:Router,
        private AutheticationService:AuthenticationService
    ){
      
      this.initRecomendador();
    }
    /**
     * @description   Metodo usado para iniciar el formulario correspondiente correo o password.
     * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
     * @version       1.0.0
     * @since         23-12-2019
     */
    initRecomendador(){
      let d 
      d = new Date();
      this.constMaxYear = d.getFullYear()+1;
      this.constMinYear = 2012;

      this.WebApiService.getRequest(AppComponent.urlService,{
          _p_action: '_recomendador',
          action: 'getBeneficios'
      }).subscribe(
          data=>{
             // console.log(data);
              if(data.success){
                  this.categoriaBeneficios = data.datos;
              }
          },
          error=>console.log(error)
      );
      if(this.data.dialog == 'correo'){
        this.viewCorreo = true;
        // this.formRecomendador = new FormGroup({
        //   // fcorreo:    new FormControl('',[Validators.required, Validators.email, Validators.maxLength(150)]),
        //   // fccorreo:   new FormControl('',[Validators.required, Validators.email, Validators.maxLength(150)])
        // });
      }
    }

    
    /**
     * @description   Metodo usado para actualizar correo o contraseña de usuario en indicar.
     * @author        Daniel Bolivar - debb94 github - daniel.bolivar.freelance@gmail.com
     * @version       1.0.0
     * @since         23-12-2019
     */
    onSubmit(){
      if(this.formRecomendador.valid){
          let body;
          this.loading.emit(true);  // loading

          
          this.WebApiService.putRequest(AppComponent.urlService,body,{
            _p_action:'_cuentaconfigurar',
            p_operacion:'updateemail'
          })
          .subscribe( // OK
            data=>{
              this.snackBar.open(
                'Información actualizada',
                'Aceptar',
                {duration:4000}
              );
              this.closeDialog();
            },
            error=>{ // ERROR
              // console.log(error);
              this.snackBar.open(
                'Error al actualizar',
                'Aceptar',
                {duration:4000}
              )
              this.closeDialog();
            }
          );
      }
      //     swal.fire({
      //       title:'',
      //       text: 'Complete la información solicitada',
      //       icon: null
      //     });
      //     this.loading.emit(false);
      // }
      //     swal.fire({
      //       title:'',
      //       text: 'Complete la información solicitada',
      //       icon: null
      //     });
      //     this.loading.emit(false);
      //   }
      // }
    }

  closeDialog(){
      this.dialogRef.close();
  }

  getRecomendation(){
    let dataRecomendador;
    dataRecomendador = {
      minPrice:   this.minPrice,
      maxPrice:   this.maxPrice,
      minYear:    this.minYear,
      maxYear:    this.maxYear,
      beneficios: this.beneficiosSelected
    };
    localStorage.setItem('dataRecomendador',JSON.stringify(dataRecomendador));
    this.closeDialog();
    this.router.navigate(['/recomendador']);
    // let dataRecomendador;
    // dataRecomendador = {
    //   minPrice:   this.minPrice,
    //   maxPrice:   this.maxPrice,
    //   minYear:    this.minYear,
    //   maxYear:    this.maxYear,
    //   beneficios: JSON.stringify(this.beneficiosSelected)
    // };
    // localStorage.setItem('dataRecomendador',JSON.stringify(dataRecomendador));
    // this.router.navigate(['/recomendador']);

    // console.log(this.minPrice,this.maxPrice, this.minYear, this.maxYear,this.beneficiosSelected);
    // let body;
    // body = {
    //   minPrice:   this.minPrice,
    //   maxPrice:   this.maxPrice,
    //   minYear:    this.minYear,
    //   maxYear:    this.maxYear,
    //   beneficios: this.beneficiosSelected
    // }
    // this.WebApiService.postRequest(AppComponent.urlService,body,{
    //   _p_action: '_recomendador',
    //   action: 'getRecomendacion'
    // })
    // .subscribe(
    //   data=>{
    //     console.log(data);

    //   },
    //   error=>{
    //     console.log(error);
    //   }
    // );
  }


}
