import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsadosRoutingModule } from './usados-routing.module';
// DEPENDENCIAS
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import {NgxMaskModule, IConfig} from 'ngx-mask';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material';
import { NgxGalleryModule } from 'ngx-gallery';
import { UtilModule } from '../util/util.module';
import {MatTooltipModule} from '@angular/material/tooltip';
// COMPONENTES
import { UsadosPublicarComponent } from './usados-publicar/usados-publicar.component';
import { UsadosClasificadosComponent } from './usados-clasificados/usados-clasificados.component';
import { UsadosClasificadosFiltroComponent } from './usados-clasificados/usados-clasificados-filtro/usados-clasificados-filtro.component';
import { UsadoDetalleComponent } from './usado-detalle/usado-detalle.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);
/* Custom Hammer configuration */
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import { UsadoConcesionarioComponent } from './usados-clasificados/usado-concesionario/usado-concesionario.component';
import { AdsenseModule } from 'ng2-adsense';
export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    'pan': {
      direction: Hammer.DIRECTION_ALL,
    }
  }
}
/* End Custom hammer configuration */

@NgModule({
  declarations: [
    UsadosPublicarComponent,
    UsadosClasificadosComponent,
    UsadosClasificadosFiltroComponent,
    UsadoDetalleComponent,
    UsadoConcesionarioComponent
  ],
  imports: [
    CommonModule,
    UsadosRoutingModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    CKEditorModule,
    SweetAlert2Module,
    NgxMaskModule,
    DragDropModule,
    FormsModule,
    NgxGalleryModule,
    UtilModule,

      // shown passing global defaults (optional)
      AdsenseModule
    // MaterialModule
  ],
  exports:[
UsadosClasificadosFiltroComponent
  ],

  providers: [
    {provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig}
  ]
})
export class UsadosModule { }
