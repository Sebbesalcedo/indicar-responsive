import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoldPaginatorComponent } from './bold-paginator/bold-paginator.component';



@NgModule({
  declarations: [BoldPaginatorComponent],
  imports: [
    CommonModule
  ],
  exports:[
    BoldPaginatorComponent
  ]
})
export class UtilModule { }
