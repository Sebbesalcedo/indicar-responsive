import { EncabezadoComponent  } from '../componentes/encabezado.component';
import { NuevoComponent } from '../componentes/nuevo.component';
import { InicioComponent  } from '../componentes/inicio.component';
import { NuevoDetalleComponent } from '../componentes/nuevo-detalle.component'
import { UsadoComponent } from '../componentes/usado.component';
import { MapaConcesionarioComponent } from '../componentes/mapa.concesionario.component';
import { ConcesionarioComponent } from '../componentes/concesionario.component';
import { VitrinaComponent } from '../componentes/vitrina.component';
import { ModuleWithProviders } from '@angular/core';
import { Route , RouterModule } from '@angular/router' ;
import { UsadoDetalleComponent } from '../componentes/usado-detalle.component'
import { FinancieraSolicitudComponent } from '../componentes/financiera-solicitud.component';
import { InicioFiltroComponent } from '../componentes/inicio-filtro.component';
import { LoginComponent } from '../componentes/login.component';
import { CuentaComponent } from '../componentes/cuenta.component';
import { AuthGuard } from './AuthGuard.servicio';
import { CuentaComentarioComponent} from '../componentes/cuenta-comentario.component';
import { CuentaConversacionesComponent} from '../componentes/cuenta-conversaciones.component';
import { CuentaFavoritoComponent} from '../componentes/cuenta-favorito.component';
import { CuentaClasificadoComponent} from '../componentes/cuenta-clasificado.component';
import { LibroAzulNuevoComponent } from '../componentes/libro.azul.nuevo.component';
import { LibroAzulUsadoComponent } from '../componentes/libro.azul.usado.component';
import { SolicitarCreditoComponent } from '../componentes/solicitar-credito.component';
import { MenuLateralUsuarioComponent } from '../componentes/menu-lateral-usuario.component'
import { ValoraComponent } from '../componentes/valora.component';
import { ValoraResultadoComponent } from '../componentes/valora-resultado.component';
import { ComentariosComponent } from '../componentes/comentarios.component';
import { CuentaSolicitudesComponent } from '../componentes/cuenta-solicitudes.component';
import { MiCuenta } from '../componentes/mi-cuenta.component';
import { Configuracion } from '../componentes/configuracion.component';
import { CuentaInicioComponent } from '../componentes/cuenta-inicio.component';
import { CuentaConfigurarComponent } from '../componentes/cuenta-configurar.component';
import { PublicarComponent } from '../componentes/publicar.component';
import { RegistroComponent } from '../componentes/registro.component';
import { RecuperarContrasena } from '../componentes/recuperar-contrasena.component';
import { CambiarContrasenaComponent } from '../componentes/cambiar-contrasena.component';
import { NoticiaComponent } from '../componentes/noticias.component';
import { NoticiaItemComponent } from '../componentes/noticias.item.component';
import { NoticiaDetalleComponent } from '../componentes/noticias.detalle.component';
import { QuienesSomosComponent } from '../componentes/quienes-somos.component';
import { AvisoPrivacidadComponent } from '../componentes/aviso-privacidad.component';

import {UsadoFiltroResponsiveComponent} from '../componentes/usado-filtro-responsive.component';
import {NuevoFiltroResponsiveComponent} from '../componentes/nuevo-filtro-responsive.component';
import { ComparadorComponent } from '../componentes/comparador.component';

const rutas: Route[] = [

     { 
        path: '', 
        redirectTo: 'inicio', 
        pathMatch: 'full' 
    },
    {
        path : 'inicio',
        component : InicioComponent
    },

    {
        path : 'encabezado',
        component : EncabezadoComponent
    },
    {
        path : 'nuevo',
        component : NuevoComponent
    },
    {
        path : 'nuevo/detalle',
        component : NuevoDetalleComponent
    },
    {
        path : 'nuevo/detalle/:id',
        component : NuevoDetalleComponent
    },
    {
        path : 'clasificados',
        component : UsadoComponent
    },
    {
        path : 'clasificados/pagina/:currentPage',
        component : UsadoComponent
    },
     {
        path : 'concesionarios',
        component : MapaConcesionarioComponent
    },
    {
        path : 'clasificados/clientes/:id',
        component : UsadoComponent
    },
    {
        path : 'filtro-usado',
        component : UsadoFiltroResponsiveComponent
    },
     {
        path : 'filtro-nuevo',
        component : NuevoFiltroResponsiveComponent
    },
    {
        path : 'clasificados/detalle',
        component : UsadoDetalleComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'inicio'
            }]
    },
    {
        path : 'clasificados/detalle/:id',
        component : UsadoDetalleComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'inicio'
            }]
    },
    {
        path : 'concesionario',
        component : ConcesionarioComponent
    },
    {
        path : 'vitrina',
        component : VitrinaComponent
    },
    {
        path: 'noticias',
        component : NoticiaComponent
    },
    {
        path: 'noticias_item',
        component : NoticiaItemComponent
    },
    {
        path: 'noticias_detalle/:id',
        component : NoticiaDetalleComponent
    },
    
    {
        path: 'quienes_somos',
        component : QuienesSomosComponent
    },
    {
        path: 'libro_azul_nuevo',
        component : LibroAzulNuevoComponent
    },
    {
        path: 'libro_azul_usado',
        component : LibroAzulUsadoComponent
    },
    {

        path: 'comparador',
        component : ComparadorComponent,
    },
    
    {
        path: 'financiera',
        component : FinancieraSolicitudComponent
    },
    {
        path : 'financiera/:tipo/:id',
        component : FinancieraSolicitudComponent
    },    
    {
        path: 'filtroinicio',
        component : InicioFiltroComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'inicio'
            }]
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'registro',
        component:RegistroComponent
    },

     {
        path:'recuperar-contrasena',
        component:RecuperarContrasena
    },

    {
        path:'cambiar-contrasena',
        component:CambiarContrasenaComponent,
        canActivate: [AuthGuard] 
    }, 
    {
        path:'cambiar-contrasena/:tk',
        component:CambiarContrasenaComponent
    }, 

    {
        path: 'mis_interesados',
        component: CuentaConversacionesComponent
    },
    {
        path: 'aviso-privacidad',
        component: AvisoPrivacidadComponent
    },

    {
        path: 'valora',
        component : ValoraComponent
    },
     {
        path: 'valora-resultado',
        component : ValoraResultadoComponent
    },
    {
        path: 'menu-lateral-usuario',
        component : MenuLateralUsuarioComponent
    },
     {
        path: 'micuenta',
        component : MiCuenta
    },
    {
        path: 'configuracion',
        component : Configuracion
    },

    {
        path: 'comentarios',
        component : ComentariosComponent
    },
    {

        path: 'publicar',
        component : PublicarComponent,
        canActivate: [AuthGuard]
    },  
    {

        path: 'solicitar-credito',
        component : SolicitarCreditoComponent
        //,        canActivate: [AuthGuard]
    },  
    {

        path: 'publicar/:id',
        component : PublicarComponent,
        canActivate: [AuthGuard]
    },
   

    
     
    
    {
        path:'cuenta',
        component:CuentaComponent,
        canActivate: [AuthGuard], 
        children: [
            {
                path: '',
                component: CuentaInicioComponent,
                outlet: 'cuenta-opcion'
            },
            {
                path: 'comentario',
                component: CuentaComentarioComponent,
                outlet: 'cuenta-opcion'
            },
            
             {
                path: 'conversaciones',
                component: CuentaConversacionesComponent,
                outlet: 'cuenta-opcion'
            },
            {

                path: 'conversaciones/:p_estado',
                component : CuentaConversacionesComponent,
                outlet: 'cuenta-opcion'
            },
       
            {
                path: 'comentario/:id',
                component: CuentaComentarioComponent,
                outlet: 'cuenta-opcion'
            },
            {
                path: 'favorito',
                component: CuentaFavoritoComponent,
                outlet: 'cuenta-opcion'
            },
            {
                path: 'clasificado',
                component: CuentaClasificadoComponent,
                outlet: 'cuenta-opcion'
            },
            {
                path: 'clasificado/:p_estado',
                component: CuentaClasificadoComponent,
                outlet: 'cuenta-opcion'
            },
            {
                path: 'solicitudes',
                component: CuentaSolicitudesComponent,
                outlet: 'cuenta-opcion'
            },
            {
                path: 'solicitudes/:p_estado',
                component: CuentaSolicitudesComponent,
                outlet: 'cuenta-opcion'
            },
            {
                path: 'inicio',
                component: CuentaInicioComponent,
                outlet: 'cuenta-opcion'
            },
            {
                path: 'configurar',
                component: CuentaConfigurarComponent,
                outlet: 'cuenta-opcion'
            }
        ]
        //,canActivate:AuthGuard
    }
];
export const routing: ModuleWithProviders = RouterModule.forRoot(rutas);





