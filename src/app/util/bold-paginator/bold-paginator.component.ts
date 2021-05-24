import { Component, OnInit, Input, Output, OnChanges,SimpleChanges,EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bold-paginator',
  templateUrl: './bold-paginator.component.html',
  styleUrls: ['./bold-paginator.component.css']
})
export class BoldPaginatorComponent implements OnInit,OnChanges {
  // configuracion
  qtyPages          = 5; // cantidad de paginas a mostrar.
  // variables
  cantItems:number  = 0;
  page:number       = 1;
  limitPage:number  = 36;
  totalPages:number = 1;

  paginator = {
    currentPage:this.page,
    pages:Array(),
    totalPages:0
  };


  @Input() items;
  @Output() setPaginator = new EventEmitter;

  constructor(private route:ActivatedRoute){ 
  }

  ngOnInit(){
    this.route.queryParams.subscribe(params=>{
      this.page = (params['currentPage'] != undefined ) ? parseInt(params['currentPage']) : 1;
      this.limitPage = (params['sizePage'] != undefined ) ? parseInt(params['sizePage']) : this.limitPage;
      this.calculatePages();
    })
  }

  ngOnChanges(changes:SimpleChanges){
    this.cantItems = changes.items.currentValue;
    this.calculatePages();
  }

  calculatePages(){
    this.totalPages = Math.ceil(this.cantItems/this.limitPage);
    let arrayPages  = Array();
    if(this.page >= this.qtyPages){ // mayor al numero de paginas iniciales.
      let sideLength  = Math.ceil(this.qtyPages/2);// paginas a los laterales de la pagina actual.
      let minSide     = (this.page-sideLength <= 0)? 1:this.page-sideLength;
      let maxSide     = (this.page+sideLength>=this.totalPages)? this.totalPages : this.page+sideLength;
      for(minSide;minSide<=maxSide;minSide++){
        if(minSide> 0 && maxSide <= this.totalPages){
          arrayPages.push(minSide);
        }
      }
    }else{
      // bucle hasta cantidad de paginas a mostrar
      for(let i = 1; i <= this.qtyPages; i++){
        if(i <= this.totalPages){
          arrayPages.push(i);
        }
      }
    }
    this.paginator = {
      currentPage: this.page,
      pages:arrayPages,
      totalPages: this.totalPages
    }
  }

  setPage(page){
    if(page > 0 && page <= this.totalPages){
      this.page = page;
      this.setPaginator.emit(page);
      this.paginator.currentPage = page;
      this.calculatePages();
    }
  }

}
