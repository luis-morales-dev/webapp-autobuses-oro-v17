import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
/*import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { SeleccionarAsientosComponent } from './components/seleccionar-asientos/seleccionar-asientos.component';
import { TerminalesComponent } from './components/terminales/terminales.component';
import { MasServiciosComponent } from './components/mas-servicios/mas-servicios.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { ResponsabilidadSocialComponent } from './components/responsabilidad-social/responsabilidad-social.component';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { PoliticasComponent } from './components/politicas/politicas.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';*/
import { ComponentsModule } from './components/components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
//import { InicioCertificacionComponent } from './inicio-certificacion/inicio-certificacion.component';

@NgModule({
  declarations: [
    AppComponent,
    //InicioCertificacionComponent,
    /*HomeComponent,
    HeaderComponent,
    FooterComponent,
    ResultadosComponent,
    SeleccionarAsientosComponent,
    TerminalesComponent,
    MasServiciosComponent,
    ContactoComponent,
    ResponsabilidadSocialComponent,
    QuienesSomosComponent,
    PreguntasFrecuentesComponent,
    PoliticasComponent,
    FacturacionComponent*/
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
