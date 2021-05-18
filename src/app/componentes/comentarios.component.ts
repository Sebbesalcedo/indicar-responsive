import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {SelectionModel} from '@angular/cdk/collections';
import {NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-user-comentarios',
  templateUrl: '../templates/comentarios.template.html',
  styleUrls: ['../css/comentarios.css']
})




export class ComentariosComponent implements OnInit {



 
      dataSource;
      displayedColumns = [];
      @ViewChild(MatSort) sort: MatSort;

      /**
       * Pre-defined columns list for user table
       */
      columnNames = [{
        id:"cod",
        value:"Cod",

       },{
        id: "picture",
        value: "Publicación",


      }, {
        id: "name",
        value: "",
  
      },
      {
        id: "fecha",
        value: "Fecha",

      },
      {
        id: "comentario",
        value: "Comentario",

      }, 
      {
        id: "boton",
        value: "",

      }];

       applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
      }

      ////// modal /////
      closeResult: string;
      constructor(private modalService: NgbModal) {}

       open(content) {
          this.modalService.open(content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        }

        private getDismissReason(reason: any): string {
          if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
          } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
          } else {
            return  `with: ${reason}`;
          }
        }

      ngOnInit() {
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.createTable();
      }
      onEdit(obj:any){
        obj.classleido="leido";
      //  console.log("XCARRRR",obj);
      }

      createTable() {
        let tableArr: Element[] = [
        { cod: 1646, picture: "", name: 'NISSAN NEW SENTRA SENSE 4P NB AUT GSL 1800 CC FE ABS 2 AB PRT', fecha: '02/22/2018', comentario: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi ', boton:"" },
        { cod: 1625, picture: "", name: 'Helium', fecha: '4.0026', comentario: 'He', boton:"" },
        { cod: 1625, picture: "", name: 'Lithium', fecha: '6.941', comentario: 'Li', boton:"" },
        { cod: 1625, picture: "", name: 'Beryllium', fecha: '9.0122', comentario: 'Be', boton:"" },
        { cod: 1625, picture: "", name: 'Boron', fecha: '10.811', comentario: 'B', boton:""},
        { cod: 1625, picture: "", name: 'Carbon', fecha: '12.0107', comentario: 'C', boton:"" }
        ];
        this.dataSource = new MatTableDataSource(tableArr);
        this.dataSource.sort = this.sort;
      }
    }

    export interface Element {
      cod:number,
      picture: string,
      name: string,
      fecha: string,
      comentario: string,
      boton:string,
    }