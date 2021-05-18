import { Component, OnInit, EventEmitter, Input,Output } from '@angular/core';
import * as _ from 'underscore';
 
import { PaginadorService } from '../servicios/index'

@Component({
  selector: 'app-paginador',
  templateUrl: '../templates/paginador.template.html'
  //,styleUrls: ['./heroes.component.css']
})
export class PaginadorComponent implements OnInit {
     paginador
     pagedItems
    @Input() total_items=1;
    @Output() eventPaginador = new EventEmitter();

    constructor(
        private pagerService: PaginadorService
    ) {
       
    }
    ngOnInit() {
        
    }
    ngOnChanges(...args: any[]) {
        //console.log('onChange fired');
        //console.log('changing', args);
        this.paginador = this.pagerService.getPager(this.total_items, 1);
        //console.log("OAAAA"+this.total_items)
    }
    setPage(page: number) {
        if (page < 1 || page > this.paginador.totalPages) {
            return;
        }
    
        // get pager object from service
        this.paginador = this.pagerService.getPager(this.total_items, page);
        //console.log(AppComponent.paginasize);
        //console.log(this.paginador)
        //// get current page of items
        //this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.eventPaginador.emit(this.paginador);
    }
} 