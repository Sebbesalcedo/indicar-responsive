import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
/* ASSETS Y DEPENDENCIAS*/
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"; // bootstrap.
import { HttpClientModule } from "@angular/common/http";
import { MatMenuModule } from "@angular/material/menu";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule, MatInputModule } from "@angular/material";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgxMaskModule} from "ngx-mask";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatCardModule } from '@angular/material/card';
import { FilterPipe } from '../pipes/filter.pipe';
import {PaginatePipe} from '../pipes/paginate.pipe';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import {MatStepperModule} from '@angular/material/stepper';
/* COMPONENTES */
import { EncabezadoComponent } from "./components/encabezado.component";
import { FooterComponent } from "./components/footer.component";
import { LoginDialog } from "./dialogs/login/login.dialog.component";
import { CuentaDialog } from "./dialogs/cuenta/cuenta.dialog.component";
import { RecomendadorDialog } from "./dialogs/recomendador/recomendador.dialog.component";
import { QuienesSomosComponent } from "./paginas/quienes-somos/quienes-somos.component";
import { AvisoPrivacidadComponent } from "./paginas/aviso-privacidad/aviso-privacidad.component";
import { PoliticasTratamientoComponent } from "./paginas/politicas-tratamiento/politicas-tratamiento.component";
import { PoliticasPublicacionComponent } from "./paginas/politicas-publicacion/politicas-publicacion.component";
import { UsadoDetalleDialog } from "./dialogs/usado-detalle/usado-detalle.dialog.component";
import { PqrsComponent } from "./paginas/pqrs/pqrs.component";
import { IntegradorComponent } from './integrador/integrador.component';
import {ResumenPagoComponent} from './wompi-forms/resumen-pago/resumen-pago.component';
import {WompiFormsComponent} from './wompi-forms/wompi-forms.component';
import {ValoradorComponent}  from './valorador/valorador.component';
import {MatListModule} from '@angular/material/list';
import {MaterialModule} from './material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { UsadosClasificadosFiltroComponent } from './usados/usados-clasificados/usados-clasificados-filtro/usados-clasificados-filtro.component';
import { GuiaPrecioComponent } from './guia-precio/guia-precio.component';



// import {PipesModule} from "../pipes/pipes.module";
// export  var options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    FooterComponent,
    LoginDialog,
    ValoradorComponent,
    RecomendadorDialog,
    CuentaDialog,
    UsadoDetalleDialog,
    QuienesSomosComponent,
    AvisoPrivacidadComponent,
    PoliticasTratamientoComponent,
    PoliticasPublicacionComponent,
    PqrsComponent,
    IntegradorComponent,
    ResumenPagoComponent,
    WompiFormsComponent,
GuiaPrecioComponent,
FilterPipe,
PaginatePipe


  ],
  entryComponents: [
    LoginDialog,
    CuentaDialog,
    UsadoDetalleDialog,
    RecomendadorDialog,
  ],
  imports: [
    BrowserModule,
    // PipesModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    MatMenuModule,
    MatListModule,
    MatExpansionModule,
    MatDialogModule,
    MatStepperModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatGridListModule,
      
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,

    // NgxMaskModule.forRoot(options)
    NgxMaskModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
