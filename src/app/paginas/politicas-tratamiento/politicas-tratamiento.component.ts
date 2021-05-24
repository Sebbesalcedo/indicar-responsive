import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-politicas-tratamiento',
  templateUrl: './politicas-tratamiento.component.html',
  styleUrls: ['./politicas-tratamiento.component.css']
})
export class PoliticasTratamientoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0,0);
  }
  scrollingAnchor(id){
      window.scrollTo(0,document.getElementById(id).offsetTop-100);
  }

}
