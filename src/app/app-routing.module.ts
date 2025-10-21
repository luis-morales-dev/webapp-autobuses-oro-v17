import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsientosRegresoComponent } from './components/asientos-regreso/asientos-regreso.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { HomeComponent } from './components/home/home.component';
import { MasServiciosComponent } from './components/mas-servicios/mas-servicios.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { SeleccionarAsientosComponent } from './components/seleccionar-asientos/seleccionar-asientos.component';
import { TerminalesComponent } from './components/terminales/terminales.component';
import { ResponsabilidadSocialComponent } from './components/responsabilidad-social/responsabilidad-social.component';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { PoliticasComponent } from './components/politicas/politicas.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { VentaPagoComponent } from './components/venta-pago/venta-pago.component';
import { AvisoDePrivacidadComponent } from './components/aviso-de-privacidad/aviso-de-privacidad.component';
import { AvisoDePrivacidadProveedoresComponent } from './components/aviso-de-privacidad-proveedores/aviso-de-privacidad-proveedores.component';
import { VacantesComponent } from './components/vacantes/vacantes.component';
import { RecorreCuernavacaComponent } from './components/blog/recorre-cuernavaca/recorre-cuernavaca.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { DwTicketComponent } from './components/dw-ticket/dw-ticket.component';
//import { InicioCertificacionComponent } from './components/inicio-certificacion/inicio-certificacion.component';
import { ValidaGuard } from './guards/valida.guard';




const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [ValidaGuard] },
  { path: 'resultados', component: ResultadosComponent, canActivate: [ValidaGuard] },
  { path: 'seleccionar-asientos', component: SeleccionarAsientosComponent },
  { path: 'asientos-regreso', component: AsientosRegresoComponent },
  { path: 'responsabilidad-social', component: ResponsabilidadSocialComponent, canActivate: [ValidaGuard] },
  { path: 'terminales', component: TerminalesComponent, canActivate: [ValidaGuard] },
  { path: 'mas-servicios', component: MasServiciosComponent, canActivate: [ValidaGuard] },
  { path: 'contacto', component: ContactoComponent, canActivate: [ValidaGuard] },
  { path: 'quienes-somos', component: QuienesSomosComponent, canActivate: [ValidaGuard] },
  { path: 'preguntas-frecuentes', component: PreguntasFrecuentesComponent, canActivate: [ValidaGuard] },
  { path: 'politicas', component: PoliticasComponent, canActivate: [ValidaGuard] },
  { path: 'facturacion', component: FacturacionComponent, canActivate: [ValidaGuard] },
  { path: 'aviso-de-privacidad', component: AvisoDePrivacidadComponent, canActivate: [ValidaGuard] },
  { path: 'aviso-de-privacidad-proveedores', component: AvisoDePrivacidadProveedoresComponent, canActivate: [ValidaGuard] },
  { path: 'vacantes', component: VacantesComponent, canActivate: [ValidaGuard] },
  { path: 'blog/recorre-cuernavaca', component: RecorreCuernavacaComponent, canActivate: [ValidaGuard] },
  { path: 'terminos-condiciones', component: TerminosCondicionesComponent, canActivate: [ValidaGuard] },
  { path: 'venta-pago', component: VentaPagoComponent },
  { path: 'descarga-boleto', component: DwTicketComponent },
  //{path:'inicio-certificacion', component:InicioCertificacionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
