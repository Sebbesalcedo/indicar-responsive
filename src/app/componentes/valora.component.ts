import { Component, OnInit } from '@angular/core';

export interface Marca {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-valora',
  templateUrl: '../templates/valora.template.html',
  styleUrls: ['../css/valora.css']
})

export class ValoraComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  marcas: Marca[] = [
    {value: 'steak-0', viewValue: 'bmw'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

}

