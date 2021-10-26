import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
/* ASSETS Y DEPENDENCIAS*/
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';                   // bootstrap.
import {HttpClientModule} from '@angular/common/http';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {DragDropModule} from '@angular/cdk/drag-drop';


/* COMPONENTES */
import { EncabezadoComponent } from './components/encabezado.component';
import { FooterComponent } from './components/footer.component';
import { LoginDialog } from './dialogs/login/login.dialog.component';
import { CuentaDialog } from './dialogs/cuenta/cuenta.dialog.component';
import { RecomendadorDialog } from './dialogs/recomendador/recomendador.dialog.component';
import { QuienesSomosComponent } from './paginas/quienes-somos/quienes-somos.component';
import { AvisoPrivacidadComponent } from './paginas/aviso-privacidad/aviso-privacidad.component';
import { PoliticasTratamientoComponent } from './paginas/politicas-tratamiento/politicas-tratamiento.component';
import { PoliticasPublicacionComponent } from './paginas/politicas-publicacion/politicas-publicacion.component';
import { UsadoDetalleDialog } from './dialogs/usado-detalle/usado-detalle.dialog.component';
import { PqrsComponent } from './paginas/pqrs/pqrs.component';

// export  var options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    FooterComponent,
    LoginDialog,
    RecomendadorDialog,
    CuentaDialog,
    UsadoDetalleDialog,
    QuienesSomosComponent,
    AvisoPrivacidadComponent,
    PoliticasTratamientoComponent,
    PoliticasPublicacionComponent,
    PqrsComponent
  ],
  entryComponents: [
    LoginDialog,
    CuentaDialog,
    UsadoDetalleDialog,
    RecomendadorDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    MatMenuModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSliderModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    DragDropModule,
    // NgxMaskModule.forRoot(options)
    NgxMaskModule.forRoot()
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
