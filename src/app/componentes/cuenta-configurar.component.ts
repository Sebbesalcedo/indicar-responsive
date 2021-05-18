import { Component, OnInit,ViewChild,Inject,EventEmitter,Output } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validator,
    ValidatorFn,
    AbstractControl,
    FormControl,
    NG_VALIDATORS,
    Validators
} from '@angular/forms'
import { WebApiPromiseService } from '../servicios/WebApiPromiseService';

import { lovTipoContrato } from '../clases/lov/lovTipoContrato.class'
import { lovPerfil } from '../clases/lov/lovPerfil.class';
import { lovTipodocumento } from '../clases/lov/lovTipodocumento.class';

import { AppComponent } from '../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { currentUser } from '../interface/currentuser.interface';

import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { ErrorMessage } from "../interface/ErrorMessage.interface";
import swal from 'sweetalert2';
import { lovCiudades } from '../clases/lov/lovCiudades.class'
import { MatPaginator, MatTableDataSource, MatSort, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions,MatDialog } from '@angular/material';
import {AddDialogComponent} from '../dialog/add-telefono.dialog';
import {AddAsesorComponent} from '../dialog/add-asesor.dialog';
import {ContrasenaDialogComponent} from '../dialog/contrasena.dialog';
import {EmailDialogComponent} from '../dialog/email.dialog';

import {Telefono} from '../modelo/Telefono.model';
import {Asesor} from '../modelo/Asesor.model';
import { FileHolder, UploadMetadata, ImageUploadComponent } from 'angular2-image-upload';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AuthenticationService } from '../servicios/AuthenticationService.servicio';
import { EncabezadoComponent } from './encabezado.component';

@Component({
    selector: 'app-cuenta-configurar',
    templateUrl: '../templates/cuenta.configurar.template.html'
    , styleUrls: ['../css/comentarios.css']
})

export class CuentaConfigurarComponent implements OnInit {
    
    // added by Daniel Bolivar
    @Output() micuenta = new EventEmitter;

    error: string = '';
    success: string = '';
    currentuser: currentUser;
    isAdmin:boolean=false;
    theemail:string;
    // telefonos permite eliminar
    moreThanOne:boolean;
    //FORM
    configurarForm: FormGroup;    
    //FILTROS
    modelo = {
        email: '',
        permitecomentario: '',
        permitecorreogestion:'',
      //  nombres: '',
      //  apellidos: '',
        nombre1:'',
        nombre2:'',
        apellido1:'',
        apellido2:'',
        razonsocial:'',
        tipodocumento: '',
        numerodocumento: '',
        fnacimiento: '',
        telefono: '',
        tcontrato: '',
        fingreso: '',
        idemostrable: '',
        tipocliente:'01',
        ubicacion_empresa:'',
        cliente_direccion:'',
        cliente_url:''
    };
    //LOVS
   
    lovTipodocumento: lovTipodocumento[];
    lovCiudades: lovCiudades[];
    lovTelefono:any;
    lovAsesor:any;
    public mask = ['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

    //public date = ['', /[0-9]/, /\d/, /\d/, '/', /[1-9]/, /\d/, /\d/, '/' , /[1-9]/, /\d/, /\d/, /\d/, /\d/]
    public numberMask = createNumberMask({
        prefix: '',
        suffix: '' // This will put the dollar sign at the end, with a space.
    });
    customErrorMessages: ErrorMessage[] = [
        {
            error: 'required',
            format: (label, error) => `${label.toUpperCase()} es Requerido!`
        }, {
            error: 'pattern',
            format: (label, error) => `${label.toUpperCase()} no es un Email Valido`
        }, {
            error: 'pattern',
            format: (label, error) => `${label.toUpperCase()} no es un Email Valido`
        }
    ];
   
    /*
    TABLA
    */
    dataSource: MatTableDataSource<Element>;
    dataSource_asesor: MatTableDataSource<Element>;
    displayedColumns = [];
    displayedColumns_asesor = [];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort_asesor: MatSort;
    @ViewChild(MatPaginator) paginator_asesor: MatPaginator;
  
    /**
     * Pre-defined columns list for user table
     */
    /*IMAGEN
     */
    @ViewChild('logoEmpresa') child: ImageUploadComponent;
    imagenes_principal = [];
    img_principal = [];
    /*IMAGEN
     */
    columnNames = [{
        id: "telefono_codigo",
        value: "telefono_"
    },
    {
        id: "telefono_numero",
        value: "telefono_numero"
    },
    {
        id: "botones",
        value: ""
    } ];

    columnNames_asesor = [{
        id: "asesor_codigo",
        value: "asesor_"
    },
    {
        id: "asesor_nombre",
        value: "asesor_nombre"
    },
    {
        id: "botones",
        value: ""
    } ];
    items;
    @Output() myEvent = new EventEmitter<string>();

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
    applyFilter_asesor(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource_asesor.filter = filterValue;
    }

    constructor(
        private fb: FormBuilder,
        private promiseService: WebApiPromiseService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        @Inject(EncabezadoComponent) private parent: EncabezadoComponent,
        private authenticationService: AuthenticationService
    ) {
        const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.configurarForm = this.fb.group({        
            email: new FormControl('', [
                Validators.required,
                Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
            ]),
            // permitecomentario: new FormControl('', [
            //     Validators.required
            // ]),
            // permitecorreogestion: new FormControl('', [
            //     Validators.required
            // ]),   
            razonsocial: new FormControl('', [
                Validators.required,                
                Validators.maxLength(100)
            ]),
            nombre1: new FormControl('', [
                Validators.required,                
                Validators.maxLength(100),
                Validators.pattern(/^[a-z]*$/)  
            ]),
            nombre2: new FormControl('', [              
                Validators.maxLength(100),
                Validators.pattern(/^[a-z]*$/) 
            ]),
            apellido1: new FormControl('', [
                Validators.required,                
                Validators.maxLength(100),
                Validators.pattern(/^[a-z]*$/) 
            ]),
            apellido2: new FormControl('', [            
                Validators.maxLength(100),
                Validators.pattern(/^[a-z]*$/) 
            ]),
            tipodocumento: new FormControl('', [               
            ]),
            numerodocumento: new FormControl('', [               
                Validators.minLength(6),
                Validators.maxLength(20)
            ]),
            fnacimiento: new FormControl('', [             
            ]),            
            telefono: new FormControl('', [               
            ]),            
            tipocliente: new FormControl('01', [
                Validators.required
            ]) ,
            ubicacion_empresa: new FormControl('', [               
            ]) ,
            cliente_direccion: new FormControl('', [                
            ]) ,
            cliente_url: new FormControl('', [   
                 Validators.pattern(reg)             
            ]) 
            
        });
        this.configurarForm.controls.ubicacion_empresa.setValue("");
        this.configurarForm.controls.ubicacion_empresa.valueChanges.subscribe(value => {
            this.promiseService.getServiceWithComplexObjectAsQueryString(
                AppComponent.urlservicio + '?_p_action=_getLovs&p_lov=_LOVCIUDADES',
                {
                    p_filtro: value
                }
            )
                .then(result => {
                    this.lovCiudades = result.datos;
                })
                .catch(error => console.log(error));
        });
       
    }
    onRemoved(file: FileHolder) {
        /*this.form_imagenes.get("imagen_principal").setValue(this.child.files.length);
        for (var i in this.form_imagenes.controls) {
            this.form_imagenes.controls[i].markAsTouched();
        }*/
    }
    onSubmit(value: string) {
        this.success = '';
        this.error = '';
       // alert(this.configurarForm.controls["tipocliente"].value);
        if(this.configurarForm.controls["tipocliente"].value=="01"){//NATURAL
            this.configurarForm.controls["nombre1"].setValidators( [Validators.required,Validators.maxLength(100)]);
            this.configurarForm.controls["apellido1"].setValidators( [Validators.required,Validators.maxLength(100)]);
            this.configurarForm.controls["nombre1"].updateValueAndValidity();
            this.configurarForm.controls["apellido1"].updateValueAndValidity(); 

            this.configurarForm.controls["razonsocial"].setValidators([Validators.maxLength(100)]);
            this.configurarForm.controls["razonsocial"].updateValueAndValidity(); 
               
        }else{//EMPRESA

            this.configurarForm.controls["razonsocial"].setValidators([Validators.required,Validators.maxLength(100)]);
            this.configurarForm.controls["razonsocial"].updateValueAndValidity(); 

            this.configurarForm.controls["nombre1"].setValue('');
            this.configurarForm.controls["apellido1"].setValue('');
            this.configurarForm.controls["tipodocumento"].setValue('NIT');
            
            this.configurarForm.controls["nombre1"].setValidators( [Validators.maxLength(100)]);
            this.configurarForm.controls["apellido1"].setValidators( [Validators.maxLength(100)]);
            this.configurarForm.controls["nombre1"].updateValueAndValidity();
            this.configurarForm.controls["apellido1"].updateValueAndValidity();    
        }
        

        if (!this.configurarForm.valid) {
            //this.error = 'Errores en el Formulario';
            swal(
                AppComponent.tituloalertas,
                'Errores en el Formulario !',
                'info'
            );
          //  window.scrollTo(0, 0);
            return;
        }
       // alert(this.configurarForm.get("telefono").value)
        if(this.configurarForm.get("telefono").value!=""&&this.configurarForm.get("telefono").value!=null)
            this.configurarForm.get("telefono").setValue(this.configurarForm.get("telefono").value.replace(/\D+/g, ''));
        //this.configurarForm.get("idemostrable").setValue(this.configurarForm.get("idemostrable").value.replace(/\D+/g, ''));

        this.imagenes_principal = [];
      
        //console.log("CHILD",this.child)
        if(this.child!=undefined){
            this.child.files.map(res => {
                this.imagenes_principal.push({
                    name: res.file.name,
                    src: res.src
                })
            });
        }

        this.promiseService.updateService(
            AppComponent.urlservicio + '?_p_action=_putCuentaConfigurar',
            {
                formulario  :   this.configurarForm.getRawValue(),
                imagen      :   this.imagenes_principal
            }    
        )
            .then(result => {                                
                swal(
                    AppComponent.tituloalertas,
                    'Datos Actualizados Correctamente !',
                    'success'
                );
                window.scrollTo(0, 0)                
            })
            .catch(error => {                
                alert(error._body);                
                window.scrollTo(0, 0)
            });


    }
    ngOnInit() {
        this.currentuser = JSON.parse(localStorage.getItem("currentUser")); 
        if( this.currentuser.tipoasesor=="ASESOR1"||this.currentuser.tipoasesor=="ASESOR2"){
            this.isAdmin=true;
        }  
        //console.log("CUSER",this.currentuser)     ;
        this.sendRequest();
        this.displayedColumns = this.columnNames.map(x => x.id);
    }
    displayFn(ciudad?: lovCiudades): string | undefined {
        console.log("ciudad", ciudad)
        return ciudad ? ciudad.ciudad_nombre : undefined;
    }
    sendRequest() {
      
        //TIPO DOCUMENTO
        this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getLovs',
            {
                p_lov: '_LOVTABLALISTA',
                p_tabla: 'ICTIPODOCUMENTO'
            }
        )
            .then(result => {
                this.lovTipodocumento = result.datos;
                console.log(this.lovTipodocumento)
            })
            .catch(error => console.log(error));
         //TIPO CONTRATO
        // alert('aaaa')
         this.promiseService.getServiceWithComplexObjectAsQueryString(
            AppComponent.urlservicio + '?_p_action=_getLovs',
            {
                p_lov: '_LOVTELEFONOCLIENTE'
            }
        )
            .then(result => {
                this.lovTelefono = result.datos;
                if(result.datos.length > 0){
                    this.moreThanOne = true;    // muestra boton para eliminar telefonos
                }else{
                    this.moreThanOne = false;   // elimina boton para eliminar telefonos
                }
                this.createTable() 
            })
            .catch(error => console.log(error));
        
            
            this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
                AppComponent.urlservicio + '?_p_action=_getLovs',
                {
                    p_lov: '_LOVASESORCLIENTE2'
                }
            )
                .then(result => {
                    this.lovAsesor = result.datos;
                    this.createTable_Asesor() 
                })
                .catch(error => console.log(error));    
            

        //CLIENTE
        this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
            AppComponent.urlservicio + '?_p_action=_getCuentaConfigurar',
            {}
        )
            .then(result => {
                if (result.registros > 0) {      
                    /*alert(result.datos[0].cliente_permitecorreogestionbool);
                    alert(result.datos[0].cliente_permitecomentariobool);
                    alert(Boolean(result.datos[0].cliente_permitecorreogestionbool));
                    alert(Boolean(result.datos[0].cliente_permitecomentariobool));*/

                    // let permitecomentario=false;
                    // if(String(result.datos[0].cliente_permitecomentario).toUpperCase()=='S'){
                    //     permitecomentario=true;
                    // }
                    // let permitegestion=false;
                    // if(String(result.datos[0].cliente_permitecorreogestion).toUpperCase()=='S'){
                    //     permitegestion=true;
                    // }
                    this.theemail = result.datos[0].cliente_correo;

                    this.configurarForm.setValue({
                        // email: result.datos[0].cliente_correo,
                        // permitecomentario: permitecomentario,  
                        // permitecorreogestion: permitegestion, 
                        permitecomentario: true,  
                        permitecorreogestion: true,                         
                        nombre1 : result.datos[0].cliente_nombre1,
                        nombre2 : result.datos[0].cliente_nombre2,
                        apellido1 : result.datos[0].cliente_apellido1,
                        apellido2 : result.datos[0].cliente_apellido2,
                        razonsocial : result.datos[0].cliente_razonsocial,
                        tipodocumento: result.datos[0].cliente_tipodocumento,
                        numerodocumento: result.datos[0].cliente_numerodocumento,
                        fnacimiento: result.datos[0].cliente_cumpleano,
                        telefono: result.datos[0].cliente_telefonocelular,                        
                        tipocliente: result.datos[0].cliente_tipocliente ,
                        ubicacion_empresa :result.datos[0].cliente_ciudad ,
                        cliente_direccion:result.datos[0].cliente_direccion,
                        cliente_url:result.datos[0].cliente_url
                    });
                    this.configurarForm.get("email").disable();


                    this.img_principal[0]=JSON.parse(result.datos[0].foto_imagen);                   
                    this.configurarForm.get('ubicacion_empresa').setValue(
                        {
                            ciudad_codigo : result.datos[0].cliente_ciudad ,
                            ciudad_nombre : result.datos[0].ciudad_nombre 
                        }    
                    );

                } else {
                    this.configurarForm.setValue({
                        // email: '',
                        // permitecomentario: '',    
                        // permitecorreogestion:'',                  
                        nombre1 : '',
                        nombre2 : '',
                        apellido1 : '',
                        apellido2 : '',
                        razonsocial : '',
                        tipodocumento: '',
                        numerodocumento: '',
                        fnacimiento: '',
                        telefono: '',                        
                        tipocliente: '01' ,
                        ubicacion_empresa:'',
                        cliente_direccion:'',
                        cliente_url:''
                    });
                    this.configurarForm.get("email").disable();
                }
            })
            .catch(error => console.log(error));
    }
    createTable() {
        let tableArr: Element[];
        this.dataSource = new MatTableDataSource(tableArr);   
        for (let o of this.lovTelefono) {      
          this.dataSource.data.push(
            {
              telefono_codigo: o.campo_codigointerno,
              telefono_numero: o.campo_descripcion
            }
          );
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
    }
    createTable_Asesor() {
        let tableArr: Element[];
        this.dataSource_asesor = new MatTableDataSource(tableArr);   
        for (let o of this.lovAsesor) {      
          this.dataSource_asesor.data.push(
            {
                telefono_codigo: o.campo_codigointerno,
                telefono_numero: o.campo_descripcion
            }
          );
        }
        this.dataSource_asesor.paginator = this.paginator_asesor;
        this.dataSource_asesor.sort = this.sort_asesor;
        this.dataSource_asesor.sort = this.sort_asesor;
    }
    add(telefono: Telefono){
        const dialogRef = this.dialog.open(AddDialogComponent, {
            data: {telefono: telefono }
          }); 
          dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {             
             this.reloadTelefono();
            }
          });                
    }
    add_asesor(asesor: Asesor){
        const dialogRef = this.dialog.open(AddAsesorComponent, {
            data: {asesor: asesor }
          }); 
          dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {             
             this.reloadAsesor();
            }
          });                
    }
    edit(p_codigo:string,p_numero:String){
        const dialogRef = this.dialog.open(AddDialogComponent, {
            data: {
                
                    telefono_codigo:p_codigo,                    
                    telefono_numero: p_numero
                 
            }
          }); 
          dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {             
             this.reloadTelefono();
            }
          });          
        return false;
    }
    edit_asesor(p_codigo:string,p_nombre:String){
        const dialogRef = this.dialog.open(AddAsesorComponent, {
            data: {                
                asesor_codigo:p_codigo,                    
                asesor_nombre: p_nombre                 
            }
          }); 
          dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {             
             this.reloadTelefono();
            }
          });          
        return false;
    }
    
    delete(p_codigo:string,p_numero:String){
        swal({
            title: 'Esta seguro?',
            text: "Eliminar este telefono "+p_numero+" !",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
          }).then((result) => {
            if (result.value) {
                this.promiseService.deleteService(
                    AppComponent.urlservicio + '?_p_action=_clientetelefono',
                    {
                        "telefono_codigo":p_codigo
                    }                   
                    )
                        .then(result => {                                
                            swal(
                                AppComponent.tituloalertas,
                                'Datos Eliminado Correctamente !',
                                'success'
                            );
                            this.reloadTelefono();
                            window.scrollTo(0, 0)                
                        })
                        .catch(error => {                
                            alert(error._body);                
                            window.scrollTo(0, 0)
                        });
            }
          })
         return false; 
    }
    delete_asesor(p_codigo:string,p_numero:String){
        swal({
            title: 'Esta seguro?',
            text: "Eliminar este asesor "+p_numero+" !",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
          }).then((result) => {
            if (result.value) {
                this.promiseService.deleteService(
                    AppComponent.urlservicio + '?_p_action=_clienteasesor',
                    {
                        "asesor_codigo":p_codigo
                    }                   
                    )
                        .then(result => {                                
                            swal(
                                AppComponent.tituloalertas,
                                'Datos Eliminado Correctamente !',
                                'success'
                            );
                            this.reloadAsesor();
                            window.scrollTo(0, 0)                
                        })
                        .catch(error => {                
                            alert(error._body);                
                            window.scrollTo(0, 0)
                        });
            }
          })
         return false; 
    }

    inactivar_cuenta(){
        swal({
            title: 'Esta seguro?',
            text: "Eliminar la Cuenta en INDICAR ?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
          }).then((result) => {
            if (result.value) {
                this.promiseService.updateService(
                    AppComponent.urlservicio + '?_p_action=_cuentaconfigurar&p_operacion=inactivarcuenta',
                    {
                        //form: this.form.value ,
                        p_operacion : 'inactivarcuenta'
                    }          
                )
                    .then(result => {
                        swal(
                            AppComponent.tituloalertas,
                            'Cuenta Inactivada Correctamente',
                            'info'
                        );   
                        this.parent.logout();
                        
                      
                                                     
                    })
                    .catch(error => {                          
                        alert(error._body);            
                    });
               
            }
          })
         return false; 
    }

    onEdit(row){
        console.log("ROW",row);
    }
    reloadTelefono(){
        this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
            AppComponent.urlservicio + '?_p_action=_getLovs',
            {
                p_lov: '_LOVTELEFONOCLIENTE'
            }
        )
            .then(result => {
                this.lovTelefono = result.datos;
                this.createTable() 
            })
            .catch(error => console.log(error));
    }
    reloadAsesor(){
        this.promiseService.getServiceWithComplexObjectAsQueryString_NoCache(
            AppComponent.urlservicio + '?_p_action=_getLovs',
            {
                p_lov: '_LOVASESORCLIENTE'
            }
        )
            .then(result => {
                this.lovAsesor = result.datos;
                this.createTable() 
            })
            .catch(error => console.log(error));
    }


     openContrasena(): void {
        const dialogRef = this.dialog.open(ContrasenaDialogComponent, {
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log("Result",result);
            
            //  alert(result);
        });
      }

    openEmail(): void {
        const dialogRef = this.dialog.open(EmailDialogComponent, {
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log("RESULT ",result);
            if(result.data=='data'){
                this.parent.logout();
            }
        });
    }
    // public activeMenu = true;
    // public active = true;
    // public data: boolean;
    // @Output() menuCuenta = new EventEmitter();
    // pasarInfoMenu(event){
    //     this.menuCuenta.emit(data:this.active)
    // }

    // pasarInfoMenu(event){
    //     this.micuenta.emit(datos)
    // }
      
}

export interface Element {
    telefono_codigo: number,
    telefono_numero: string
  }
  export interface Element_Asesor {
    asesor_codigo: number,
    asesor_nombre: string
  }  
 