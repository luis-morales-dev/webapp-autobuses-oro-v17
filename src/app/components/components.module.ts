import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { SeleccionarAsientosComponent } from './seleccionar-asientos/seleccionar-asientos.component';
import { TerminalesComponent } from './terminales/terminales.component';
import { MasServiciosComponent } from './mas-servicios/mas-servicios.component';
import { ContactoComponent } from './contacto/contacto.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { OrigenDestinoComponent } from './origen-destino/origen-destino.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { LoaderComponent } from './loader/loader.component';
import { VentaPagoComponent } from './venta-pago/venta-pago.component';
import { PopalertComponent } from './popalert/popalert.component';
import { ProgressComponent } from './progress/progress.component';
import { AutobusComponent } from './autobus/autobus.component';
import { AsientosRegresoComponent } from './asientos-regreso/asientos-regreso.component';
import { PopmessageComponent } from './popmessage/popmessage.component';
import { PoperrorComponent } from './poperror/poperror.component';
import { ResponsabilidadSocialComponent } from './responsabilidad-social/responsabilidad-social.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes/preguntas-frecuentes.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { AvisoDePrivacidadComponent } from './aviso-de-privacidad/aviso-de-privacidad.component';
import { VacantesComponent } from './vacantes/vacantes.component';
import { CuerpomodalComponent } from './cuerpomodal/cuerpomodal.component';
import { AvisoDePrivacidadProveedoresComponent } from './aviso-de-privacidad-proveedores/aviso-de-privacidad-proveedores.component';
import { RecorreCuernavacaComponent } from './blog/recorre-cuernavaca/recorre-cuernavaca.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { DwTicketComponent } from './dw-ticket/dw-ticket.component';
//import { InicioCertificacionComponent } from './inicio-certificacion/inicio-certificacion.component';




@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ResultadosComponent,
    SeleccionarAsientosComponent,
    TerminalesComponent,
    MasServiciosComponent,
    ContactoComponent,
    OrigenDestinoComponent,
    LoaderComponent,
    ResponsabilidadSocialComponent,
    QuienesSomosComponent,
    PreguntasFrecuentesComponent,
    PoliticasComponent,
    FacturacionComponent,
    VentaPagoComponent,
    PopalertComponent,
    PoperrorComponent,
    AvisoDePrivacidadComponent,
    VacantesComponent,
    PopmessageComponent,
    ProgressComponent,
    AutobusComponent,
    CuerpomodalComponent,
    AsientosRegresoComponent,
    AvisoDePrivacidadProveedoresComponent,
    RecorreCuernavacaComponent,
    TerminosCondicionesComponent,
    DwTicketComponent
    //InicioCertificacionComponent,
  ],
  exports:[
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ResultadosComponent,
    SeleccionarAsientosComponent,
    TerminalesComponent,
    MasServiciosComponent,
    ContactoComponent,
    OrigenDestinoComponent,
    LoaderComponent,
    ResponsabilidadSocialComponent,
    QuienesSomosComponent,
    PreguntasFrecuentesComponent,
    PoliticasComponent,
    FacturacionComponent,
    VentaPagoComponent,
    AutobusComponent,
    AsientosRegresoComponent,
    PopmessageComponent,
    DwTicketComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
  ]
})
export class ComponentsModule { }
