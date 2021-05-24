import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: '../templates/footer.component.html',
  styleUrls: ['../css/footer.component.css']
})
export class FooterComponent implements OnInit {

  fecha       = null;
  constructor() { }

  ngOnInit() {
    let d = new Date();
    this.fecha = d.getFullYear();
  }

}
