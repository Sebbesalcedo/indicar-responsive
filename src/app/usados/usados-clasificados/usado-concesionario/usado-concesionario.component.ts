import { Component, OnInit, Input, SimpleChanges, OnChanges, SimpleChange, Inject } from '@angular/core';
import { EncabezadoComponent } from 'src/app/components/encabezado.component';

@Component({
  selector: 'app-usado-concesionario',
  templateUrl: './usado-concesionario.component.html',
  styleUrls: ['./usado-concesionario.component.css']
})
export class UsadoConcesionarioComponent implements OnInit, OnChanges {
  // VARIABLES
  @Input() data:any;
  telefonos:any;

  constructor(
    @Inject(EncabezadoComponent) public encabezado:EncabezadoComponent
  ){}
  ngOnInit(){
    let links;
    links = document.querySelectorAll('.active-link');
    links.forEach(element=>{
      if(element.innerText == "Clasificados"){
        element.classList.remove('active-link');
      }
    })
  }

  ngOnChanges(changes:SimpleChanges){
    let data:SimpleChange = changes.data.currentValue;
    if(data != undefined){
      if(data['telefonos'] != undefined){
        this.telefonos = data['telefonos'];
      }
    }
  }

}
