import { Component, OnInit, ChangeDetectorRef, HostListener, Inject, OnDestroy  } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatTableDataSource, MatSort, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material';

import { DOCUMENT } from "@angular/platform-browser";

import {MatSidenavModule} from '@angular/material/sidenav';

import {MediaMatcher} from '@angular/cdk/layout';


export interface PeriodicElement {
  linea: string;
  valor: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {linea: 'A1 1.4 SPORTBACK TFSI S-TRONIC AMBITION', valor: '99.900.000'},
  {linea: 'A3 2.0 SPORTBACK TFSI S-TRONIC AMBITION ', valor: '120.900.000'},
  {linea: 'A3 2.0 SPORTBACK TFSI S-TRONIC PROGRESIVE ', valor: '132.900.000'},
  {linea: 'A3 1.2 SEDÁN TFSI S-TRONIC AMBITION', valor: '117.900.000'},
  {linea: 'A3 2.0 SEDÁN TFSI S-TRONIC AMBITION', valor: '125.900.000'},
  {linea: 'S3 2.0 SEDÁN TFSI SPORT', valor: '162.900.000'},
  {linea: 'A4 2.0 TFSI S-TRONIC AMBITION', valor: '139.900.000'},
  {linea: 'A4 2.0 TFSI S-TRONIC PROGRESSIVE QUATTRO ', valor: '179.900.000'},
  {linea: 'A4 S4 V6 3.0 TIP QUATTRO ', valor: '281.900.000'},
  {linea: 'A5 2.0 TFSI S-TRONIC AMBITION ', valor: '199.900.000'},
  {linea: 'A5 2.0 SPORTBACK TFSI S-TRONIC PROGRESSIVE ', valor: '199.900.000'},
  {linea: 'A5 2.0 CABRIO TFSI S-TRONIC ATTRACTION', valor: '168.900.000'},
  {linea: 'A7 SPORTBACK 3.0 TFSI S-TRONIC QUATTRO  ', valor: '309.900.000'},
  {linea: 'TT 2.0 TFSI ST COUPÉ ', valor: '176.900.000'},
  {linea: 'TT 2.0 TFSI ST ROADSTER ', valor: '176.900.000'},
  {linea: 'R8 V10 5.2 TFSI PLUS ', valor: '749.900.000'},
]; 

@Component({
  selector: 'app-valora',
  templateUrl: '../templates/libro.azul.nuevo.template.html',
  styleUrls: ['../css/libro_azul.css']
  
})

export class LibroAzulNuevoComponent implements OnInit , OnDestroy{

   mobileQuery: MediaQueryList;

  panelOpenState = false;
  mapaR=false;

  displayedColumns: string[] = ['linea', 'valor'];
  dataSource = new MatTableDataSource (ELEMENT_DATA); 

  step = 0;
  public numMapa;
  categoriaMapa:any='';

  setStep(index: number) {
    this.step = index;
    document.body.scrollTop = document.documentElement.scrollTop = 169;
    this.mapaR=false;
  }

  public fixed: boolean = false;

  private _mobileQueryListener: () => void;


  constructor(
    @Inject (DOCUMENT) private document: Document, private media: MediaMatcher, changeDetectorRef: ChangeDetectorRef,) { 
    this.mobileQuery = media.matchMedia('(max-width:768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this.mobileQuery = media.matchMedia('(max-width:768px)');}

  ngOnInit() {
    window.scrollTo(0, 0)

  }

  ngOnDestroy() {
     this.mobileQuery.removeListener(this._mobileQueryListener);
  }

 @HostListener("window:scroll", []) onWindowScroll() {
    let numbr = this.document.body.scrollTop;
    this.numMapa =  this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

    if ( this.numMapa >285 ) {
        this.fixed = true;
        this.categoriaMapa={
         'top': String(this.numMapa - 350)+'px'
        };
    }else if (this.fixed && this.numMapa < 285) {
        this.fixed = false;
        this.categoriaMapa={
         'top': String(0)+'px'
        };

    }

    

    console.log('hoola'+ this.categoriaMapa)


     console.log('numMapa='+this.numMapa, 'fixed='+this.fixed);

     
 }


}

