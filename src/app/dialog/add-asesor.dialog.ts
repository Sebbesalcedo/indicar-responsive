import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Asesor} from '../modelo/Asesor.model';
import { AppComponent } from '../app.component';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import swal from 'sweetalert2';
@Component({
  selector: 'asesor-add.dialog',
  templateUrl: './add-asesor.dialog.html'
})

export class AddAsesorComponent {
  constructor(  public dialogRef: MatDialogRef<AddAsesorComponent>,
                private promiseService: WebApiPromiseService,
                @Inject(MAT_DIALOG_DATA) public data: Asesor) { 
                    if(data.asesor_codigo==null){
                        this.titulo="Agregar Asesor"
                    }else{
                        this.titulo="Editar Asesor"
                    }
                   
                }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);
  titulo:string;

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo requerido' :
      this.formControl.hasError('email') ? 'Email invalido' :
        '';
  }

  submit() {
      //console.log("FC",this.data)
      //alert('submit')
  // emppty stuff
    if(this.data.asesor_codigo==null)
        this.promiseService.createService(
            AppComponent.urlservicio + '?_p_action=_clienteasesor',
            {
                "asesor_nombre":this.data.asesor_nombre
            }
            //this.formControl.getRawValue()
        )
            .then(result => {                                
                swal(
                    AppComponent.tituloalertas,
                    'Datos Actualizados Correctamente !',
                    'success'
                );
                window.scrollTo(0, 0)                
            })
            .catch(error => {                
                alert(error._body);                
                window.scrollTo(0, 0)
            });
    else{
        this.promiseService.updateService(
            AppComponent.urlservicio + '?_p_action=_clienteasesor',
            {
                "asesor_codigo":this.data.asesor_codigo,
                "asesor_nombre":this.data.asesor_nombre
            }
            //this.formControl.getRawValue()
        )
            .then(result => {                                
                swal(
                    AppComponent.tituloalertas,
                    'Datos Actualizados Correctamente !',
                    'success'
                );
                window.scrollTo(0, 0)                
            })
            .catch(error => {                
                alert(error._body);                
                window.scrollTo(0, 0)
            }); 
    }        
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    //this.dataService.addIssue(this.data);
  }
}