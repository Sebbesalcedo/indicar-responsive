import { Component, OnInit } from '@angular/core';
import { SwiperModule } from 'angular2-useful-swiper';

@Component({
  selector: 'app-vitrina',
  templateUrl: '../templates/vitrina.template.html',
  styleUrls: ['../css/vitrina.css']
  /*host: {
        '(window:scroll)': 'onScroll($event)',
  }*/
})

export class VitrinaComponent implements OnInit {

    tarjetaFav=false;
    toggleSwiper=false;
    tarjetaComp=false;
    //Configuración Swipe 
    images: string[];
    	config: any = {
        
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        lazy: true,
        speed: 100,

    };
   /* //Config Scroll para nombre de vehículo en vitrina
    isScrolled = false;
    currPos: Number = 0;
    startPos: Number = 0;
    changePos: Number = 400;*/

    constructor() { 

    }

    ngOnInit() {

    }
    /* Evento Scroll para nombre de vehículo en vitrina
    onScroll(evt) {//window object can be wrapper in a service but for now we directly use it
        this.currPos = (window.pageYOffset || evt.target.scrollTop) - (evt.target.clientTop || 0);
        if(this.currPos >= this.changePos ) {
            this.isScrolled = true;
        } else {
            this.isScrolled = false;
        }
    }*/



}

