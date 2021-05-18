import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-politica-tratamiento',
  templateUrl: '../templates/politica-tratamiento.template.html',
  styleUrls: ['../css/financia.css']
})
export class PoliticaTratamientoComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  scrollingAnchor(id){
      window.scrollTo(0,document.getElementById(id).offsetTop-100);
  }

}
