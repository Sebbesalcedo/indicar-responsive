import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MomentModule } from 'angular2-moment';



import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { GoogleAnalyticsService } from './servicios/google/analytics/google-analytics.service';

import { AppComponent } from './app.component';
import { EncabezadoComponent } from './componentes/encabezado.component';
import { InicioComponent } from './componentes/inicio.component';
import { VitrinaComponent } from './componentes/vitrina.component';
import { NuevoComponent } from './componentes/nuevo.component';
//import { routing } from './servicios/rutas';
import { HttpModule } from '@angular/http';
import { NuevosServicio } from './servicios/nuevos.servicio';
import { lovsServicio } from './servicios/lovs.servicio';
import { EncryptService } from './servicios/encrypt.service';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { WebApiPromiseService } from './servicios/WebApiPromiseService';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'ngx-useful-swiper';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';


import { PaginadorService   } from './servicios/index';
import { NuevoFiltroComponent } from './componentes/nuevo-filtro.component';
import { NuevoFiltroResponsiveComponent } from './componentes/nuevo-filtro-responsive.component';
import { NuevoItemComponent } from './componentes/nuevo-item.component';
import { NuevoDetalleComponent, ValuesPipe } from './componentes/nuevo-detalle.component';
import { PaginadorComponent } from './componentes/paginador.component';
import { UsadoComponent } from './componentes/usado.component';
import { UsadoFiltroComponent } from './componentes/usado-filtro.component';
import { UsadoFiltroResponsiveComponent } from './componentes/usado-filtro-responsive.component';
import { UsadoItemComponent } from './componentes/usado-item.component';
import { UsadoDetalleComponent, DialogContentExampleDialog } from './componentes/usado-detalle.component';

import { MapaItemConcesionarioComponent } from './componentes/mapa.item.concesionario.component';
import { MapaConcesionarioComponent } from './componentes/mapa.concesionario.component';
import { MapaConcesionarioFiltroComponent } from './componentes/mapa.filtro.concesionario.component';
import { MapaFiltroConcesionarioResponsiveComponent } from './componentes/mapa-filtro-concesionario-responsive.component';

import { ConcesionarioComponent } from './componentes/concesionario.component';

import { FinancieraSolicitudComponent } from './componentes/financiera-solicitud.component';
import { InicioFiltroComponent } from './componentes/inicio-filtro.component';
import { MenuLateralUsuarioComponent } from './componentes/menu-lateral-usuario.component';
import { ValoraComponent } from './componentes/valora.component';
import { ValoraResultadoComponent } from './componentes/valora-resultado.component';
import { ComentariosComponent } from './componentes/comentarios.component';
import { MiCuenta } from './componentes/mi-cuenta.component';
import { Configuracion } from './componentes/configuracion.component';
import { PublicarComponent } from './componentes/publicar.component';
import { NoticiaComponent } from './componentes/noticias.component';
import { NoticiaDetalleComponent } from './componentes/noticias.detalle.component';
import { NoticiaItemComponent } from './componentes/noticias.item.component';
import { QuienesSomosComponent } from './componentes/quienes-somos.component';
import { LibroAzulNuevoComponent } from './componentes/libro.azul.nuevo.component';
import { LibroAzulUsadoComponent } from './componentes/libro.azul.usado.component';
import { ComparadorComponent } from './componentes/comparador.component';
import { AvisoPrivacidadComponent } from './componentes/aviso-privacidad.component';
import { PoliticaPublicacionComponent } from './componentes/politica-publicacion.component';

import { SolicitarCreditoComponent } from './componentes/solicitar-credito.component';

import { AuthGuard } from './servicios/AuthGuard.servicio';
import { AuthenticationService } from './servicios/AuthenticationService.servicio';
import { LoginComponent } from './componentes/login.component';
import { RegistroComponent } from './componentes/registro.component';
import { CambiarContrasenaComponent } from './componentes/cambiar-contrasena.component';
import { RecuperarContrasena } from './componentes/recuperar-contrasena.component';
import { CuentaComponent} from './componentes/cuenta.component';
import { CuentaComentarioComponent} from './componentes/cuenta-comentario.component';
import { CuentaFavoritoComponent } from './componentes/cuenta-favorito.component';
import { CuentaClasificadoComponent,DialogConfirmar } from './componentes/cuenta-clasificado.component';
import { CuentaSolicitudesComponent } from './componentes/cuenta-solicitudes.component';

import { CuentaConversacionesComponent} from './componentes/cuenta-conversaciones.component';

import { CuentaInicioComponent} from './componentes/cuenta-inicio.component';

import { CuentaConfigurarComponent } from './componentes/cuenta-configurar.component';

import { ImageUploadModule } from 'angular2-image-upload';
import { TextMaskModule } from 'angular2-text-mask';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

import {CUSTOM_ERRORS} from './componentes/custom-errors.component';
import {MatStepperModule,MatStepperIntl} from '@angular/material/stepper';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import { MatAutocompleteModule  } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
// MdListModule
import { LoadingModule } from 'ngx-loading';

// app.module.ts
import { NgxGalleryModule } from 'ngx-gallery';


import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ngfModule } from 'angular-file';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material';

import {CdkTableModule} from '@angular/cdk/table';

import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';

registerLocaleData(localeEsCO, 'es-CO');

import {MatTableModule} from '@angular/material/table';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { AppRoutingModule }     from './app-routing.module';
import {
    MatNativeDateModule,
    MatSort,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatChipsModule


} from '@angular/material';

// Import your library
import { AlertComponent } from './directivas/Alert.component';
import { AlertService } from './servicios/Alert.servicio';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
// import { NuevotarjetaComponent } from './componentes/nuevotarjeta.component';
// import { RelacionadosComponent } from './componentes/relacionados.component';
import {NgxMaskModule} from 'ngx-mask';

import {NgBreadcrumbModule, BreadcrumbService} from 'ng-breadcrumb';
import {GroupByPipe } from './pipes/groupBy.pipes';
import {OrderBy } from './pipes/orderBy.pipes';
import {AddDialogComponent} from './dialog/add-telefono.dialog';
import {AddAsesorComponent} from './dialog/add-asesor.dialog';

import {ContrasenaDialogComponent} from './dialog/contrasena.dialog';
import {EmailDialogComponent} from './dialog/email.dialog';
import {AgregarVehiculoDialogComponent} from './dialog/agregarVehiculo.dialog';
import {ExcelService} from './servicios/ExcelService .servicio';

import { NgxDateRangePickerModule } from 'ngx-daterangepicker';
import { PoliticaTratamientoComponent } from './componentes/politica-tratamiento.component';
import { PublicacionClasificadosComponent } from './componentes/publicacion-clasificados.component';

// import { NgxDaterangepickerModule } from '@qqnc/ngx-daterangepicker';
// import { NgxDaterangepickerModule } from '@qqnc/ngx-daterangepicker';
// import { Ng2ImgMaxModule } from 'ng2-img-max'; // <-- import the module
@NgModule({
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatChipsModule
  ]
})
export class DemoMaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    PaginadorComponent,
    EncabezadoComponent,
    NuevoComponent,
    NuevoFiltroComponent,
    NuevoFiltroResponsiveComponent,
    NuevoItemComponent,
    NuevoDetalleComponent,
    UsadoComponent,
    ValuesPipe,
    VitrinaComponent,
    UsadoFiltroComponent,
    UsadoFiltroResponsiveComponent,
    UsadoItemComponent,
    MapaItemConcesionarioComponent,
    MapaConcesionarioComponent,
    MapaConcesionarioFiltroComponent,
    MapaFiltroConcesionarioResponsiveComponent,
    UsadoDetalleComponent,
    DialogContentExampleDialog,
    ConcesionarioComponent,
    FinancieraSolicitudComponent,
    InicioFiltroComponent,
    LoginComponent,
    RegistroComponent,
    CambiarContrasenaComponent,
    RecuperarContrasena,
    CuentaComponent,
    CuentaComentarioComponent,
    CuentaConversacionesComponent,
    CuentaFavoritoComponent,
    CuentaClasificadoComponent,
    ValoraComponent,
    NoticiaComponent,
    NoticiaItemComponent,
    NoticiaDetalleComponent,
    ValoraResultadoComponent,
    ComentariosComponent,
    MenuLateralUsuarioComponent,
    CuentaSolicitudesComponent,
    MiCuenta,
    Configuracion,
    CuentaInicioComponent,
    CuentaConfigurarComponent,
    PublicarComponent
    ,DialogConfirmar,
    SolicitarCreditoComponent ,
    AlertComponent ,
    GroupByPipe ,
    OrderBy,
    AddDialogComponent ,
    AddAsesorComponent,
    ContrasenaDialogComponent,
    EmailDialogComponent,
    AgregarVehiculoDialogComponent,
    QuienesSomosComponent,
    LibroAzulNuevoComponent,
    LibroAzulUsadoComponent,
    ComparadorComponent,
    AvisoPrivacidadComponent,
    PoliticaTratamientoComponent,
    PublicacionClasificadosComponent
  ],
  imports: [
  JwSocialButtonsModule,
    NgbModule.forRoot(),
    MatDialogModule,
    BrowserModule,
    //routing,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    SwiperModule,
    LazyLoadImagesModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot(),
    TextMaskModule,
    NgBootstrapFormValidationModule.forRoot(CUSTOM_ERRORS)  ,
    MatStepperModule
    ,BrowserModule, BrowserAnimationsModule
    ,MatFormFieldModule
    ,MatInputModule
    ,MatSelectModule
    ,MatListModule
    ,MatAutocompleteModule
    ,MatCheckboxModule
    ,MatRadioModule
    ,NgxGalleryModule
    ,LoadingModule
    , HttpClientModule
    , ngfModule
    ,DemoMaterialModule
    ,NgBreadcrumbModule
    ,MatSnackBarModule
    ,MatNativeDateModule

    , MatNativeDateModule
    ,MatSnackBarModule
    // , AlertModule.forRoot()
    // , AlertModule.forRoot({maxMessages: 5, timeout: 5000})
    ,SweetAlert2Module.forRoot()
    ,NgxMaskModule.forRoot({})
    // NgxDaterangepickerModule
    , NgxDateRangePickerModule,
    MomentModule
    // Ng2ImgMaxModule
  ],
  providers: [
    NuevosServicio,
    lovsServicio,
    WebApiPromiseService,
    PaginadorService,
    AuthGuard,
    AuthenticationService ,
    MatStepperIntl,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    AlertService,
    BreadcrumbService,
    GoogleAnalyticsService,
    ExcelService,
    EncabezadoComponent,
    EncryptService,
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ],

  entryComponents: [
    UsadoDetalleComponent,
    DialogContentExampleDialog,
    PublicarComponent,
    CuentaComentarioComponent,
    CuentaConversacionesComponent,
    CuentaClasificadoComponent,
    DialogConfirmar,
    FinancieraSolicitudComponent,
    SolicitarCreditoComponent,
    AddDialogComponent,
    AddAsesorComponent,
    ContrasenaDialogComponent,
    EmailDialogComponent,
    AgregarVehiculoDialogComponent
  ],


  bootstrap: [AppComponent]

})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);

