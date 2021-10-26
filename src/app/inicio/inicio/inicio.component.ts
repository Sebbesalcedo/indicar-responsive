import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { EncabezadoComponent } from 'src/app/components/encabezado.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {
  

  public loading:boolean;

  constructor(
    private route:ActivatedRoute,
    @Inject(EncabezadoComponent) private encabezado:EncabezadoComponent
  ){ }

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      let token = params.get('token');
      if(token != null){
        this.getRecord(token);
      }
    });
    window.scrollTo(0,0);
  }
  ngAfterViewInit(){
    window.scrollTo(0,0);
  }



  getRecord(token:string){
    this.encabezado.recoveryPassword(token);
  }

}



// if (this.route.snapshot.paramMap.get('tk') != null) {
//   this.p_consecutivo=this.route.snapshot.paramMap.get('tk');
//   this.get_record(this.route.snapshot.paramMap.get('tk'))
// }else{                        
//     this.p_consecutivo=null;
// //    this.sendRequest_change();
// }
// }
// public init_form(){
// this.form = this.fb.group({
//   password: new FormControl('', [
//       Validators.required
//   ]),
//   confirmacionpassword: new FormControl('', [
//     Validators.required
// ])
// });
// }
// get_record(token:string){
// this.loading = true;
//     this.promiseService.getServiceWithComplexObjectAsQueryString(
//         AppComponent.urlservicio + '?_p_action=_recuperarpsw',
//         {
//             p_token:token
//         }
//     )
//         .then(result => {
//             this.disable=false;
//             if(!result.success){
//               swal(
//                 '',
//                 'Error en el Validacion '+result.mensaje,
//                 null
//               );
//               this.disable=true;
//             }else{
//              // this.p_consecutivo=result.success
//             }               
//         })
//         .catch(error => {
//             alert(error._body);
//         });
// }