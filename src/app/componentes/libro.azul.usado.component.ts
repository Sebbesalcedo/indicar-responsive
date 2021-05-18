import { Component, OnInit, ChangeDetectorRef, HostListener, Inject, OnDestroy  } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatTableDataSource, MatSort, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material';

import { DOCUMENT } from "@angular/platform-browser";

import {MatSidenavModule} from '@angular/material/sidenav';

import {MediaMatcher} from '@angular/cdk/layout';

export interface PeriodicElement {
  linea: string;
  y18, y17, y16, y15, y14, y13, y12, y11, y10, y09, y08, y07: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
 {linea:'A1 COUPÉ 1.4 TFSI ATTRACTION S-TRONIC', y18:'', y17:'', y16:'56.0', y15:'52.1', 
  y14:' 58.4', y13:' 45.0', y12:' 41.9', y11:' 39.0', y10:'', y09:'', y08:'', y07:''},
  {linea:'A1 COUPÉ 1.4 TFSI AMBITION S-TRONIC ', y18:'', y17:'', y16:'', y15:'', 
  y14:'', y13:' 49.0', y12:' 45.6', y11:' 42.4', y10:'', y09:'', y08:'', y07:''},
  {linea:'A1 1.4 TFSI SPORTBACK S-TRONIC AMBITION ', y18:' 76.0', y17:' 70.7', y16:'', y15:' 61.0', 
  y14:' 56.7', y13:' 52.8', y12:'', y11:'', y10:'', y09:'', y08:'', y07:''},
  {linea:'NEW A3 1.2 T. 3P', y18:'', y17:'', y16:'', y15:' 61.0', 
  y14:' 56.7', y13:'', y12:'', y11:'', y10:'', y09:'', y08:'', y07:''},
  {linea:'NEW A3 1.2 T. S-TRONIC 3P', y18:' 79.0', y17:' 73.5', y16:'', y15:'', 
  y14:'', y13:'', y12:'', y11:'', y10:'', y09:'', y08:'', y07:''},
  {linea:'NEW A3 ATTRACTION 1.2 T. 5P', y18:'', y17:'', y16:'', y15:' 65.0', 
  y14:' 60.5', y13:'', y12:'', y11:'', y10:'', y09:'', y08:'', y07:''},
  {linea:'NEW A3 ATTRACTION 1.2 T. 5P S-TRONIC', y18:'', y17:'', y16:'', y15:' 68.0', 
  y14:' 63.2', y13:'', y12:'', y11:'', y10:'', y09:'', y08:'', y07:''},
  {linea:'NEW A3 AMBITION 2', y18:' 88.0', y17:' 81.8', y16:' 76.1', y15:' 70.8', 
  y14:'', y13:'', y12:'', y11:'', y10:'', y09:'', y08:'', y07:''},
];

@Component({
  selector: 'app-valora',
  templateUrl: '../templates/libro.azul.usado.template.html',
  styleUrls: ['../css/libro_azul.css']
  
})

export class LibroAzulUsadoComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  panelOpenState = false;
  mapaR=false;

   step = 0;
  displayedColumns: string[] = ['linea', 'y18', 'y17', 'y16', 'y15', 'y14', 'y13', 'y12', 'y11', 'y10', 'y09', 'y08', 'y07'];
  dataSource = new MatTableDataSource (ELEMENT_DATA);


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

