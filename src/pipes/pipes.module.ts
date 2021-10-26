import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { PaginatePipe } from './paginate.pipe';
import {MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import {CustomMatPaginatorIntl} from './paginator.es';

@NgModule({
  declarations: [FilterPipe, PaginatePipe],
  imports: [
    CommonModule
  ],
  exports:[
    FilterPipe,
    PaginatePipe
  ],
  providers:[{
    provide:MatPaginatorIntl,
    useClass:CustomMatPaginatorIntl
  }]
})
export class PipesModule { }
