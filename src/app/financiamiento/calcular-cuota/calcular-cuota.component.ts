import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// DEPENDENCIAS
import swal from 'sweetalert2';

@Component({
  selector: 'app-calcular-cuota',
  templateUrl: './calcular-cuota.component.html',
  styleUrls: ['./calcular-cuota.component.css']
})
export class CalcularCuotaComponent implements OnInit {
  // VARIABLES
  formCalcularCuota:any;
  cuotaCalculada:boolean    = false;
  cuotaAFinanciar;
  valorFinanciar;
  valorFinanciarFijo;
  tasa;
  plazo;

  constructor() {
  }

  ngOnInit() {
    this.initForm();
    window.scrollTo(0, 0);
  }

  initForm(){
    this.formCalcularCuota = new FormGroup({
      fvalorvehiculo  : new FormControl('',[Validators.required]),
      fcuotainicial   : new FormControl('',[Validators.required]),
      ftipovehiculo   : new FormControl('',[Validators.required]),
      fclase          : new FormControl('',[Validators.required]),
      fplazo          : new FormControl('',[Validators.required])
    });
  }


  onCalcular(){
    if(this.formCalcularCuota.get('fvalorvehiculo').value <= 0){
      swal.fire({
        title:'',
        icon:null,
        text: 'Valor del vehiculo debe ser mayor a 0'
      });
    }else if(this.formCalcularCuota.valid){
      this.plazo = this.formCalcularCuota.get('fplazo').value;
      // this.valorFinanciar = this.formCalcularCuota.get('fvalorvehiculo').value;
      this.cuotaAFinanciar = this.payment(1.0,(this.plazo*12),this.valorFinanciar,0);
      this.tasa = 1.0;
      this.cuotaCalculada = true;
      this.valorFinanciarFijo = this.valorFinanciar
    }else{
      swal.fire({
        title:'',
        icon:null,
        text: 'Complete la información requerida'
      });
    }
  }

  payment(i,n,VA,S){           
    let den=( 1.0+ (i*S/100.0) ) *(1.0 - Math.pow(1.0+(i/100.0),(n*(-1))) ) / (i/100.0);
    let PAGO=VA/den;
    return (PAGO*(1.0));
  }

  valorFinanciamiento(){
    let valorVehiculo = parseInt(this.formCalcularCuota.get('fvalorvehiculo').value);
    let cuotaInicial = (this.formCalcularCuota.get('fcuotainicial').value == '') ? 0 : parseInt(this.formCalcularCuota.get('fcuotainicial').value);
    if(valorVehiculo > cuotaInicial){
      let valorVehiculo;
      let cuota;
      if(this.formCalcularCuota.get('fvalorvehiculo').value ==''){
        valorVehiculo = 0;
      }else{
        valorVehiculo = this.formCalcularCuota.get('fvalorvehiculo').value;
      }
      if(this.formCalcularCuota.get('fcuotainicial').value ==''){
        cuota = 0;
      }else{
        cuota = this.formCalcularCuota.get('fcuotainicial').value;
      }
      if(valorVehiculo >0){
        this.valorFinanciar = valorVehiculo - cuota;
      }
    }else{
      swal.fire({
        title: '',
        icon: null,
        text: 'Valor del vehiculo debe ser mayor que la cuota inicial'
      });
      this.formCalcularCuota.get('fvalorvehiculo').setValue(0);
      this.formCalcularCuota.get('fcuotainicial').setValue(0);
      this.valorFinanciar = 0;
    }
  }

}

