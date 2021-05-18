import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Telefono} from '../modelo/Telefono.model';
import { AppComponent } from '../app.component';
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';
import swal from 'sweetalert2';
@Component({
  selector: 'telefono-add.dialog',
  templateUrl: './add-telefono.dialog.html'
})

export class AddDialogComponent {
  constructor(  public dialogRef: MatDialogRef<AddDialogComponent>,
                private promiseService: WebApiPromiseService,
                @Inject(MAT_DIALOG_DATA) public data: Telefono) { 
                    if(data.telefono_codigo==null){
                        this.titulo="Agregar telefono"
                    }else{
                        this.titulo="Editar telefono"
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
    if(this.data.telefono_codigo==null)
        this.promiseService.createService(
            AppComponent.urlservicio + '?_p_action=_clientetelefono',
            {
                "telefono_numero":this.data.telefono_numero
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
            AppComponent.urlservicio + '?_p_action=_clientetelefono',
            {
                "telefono_numero":this.data.telefono_numero,
                "telefono_codigo":this.data.telefono_codigo
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