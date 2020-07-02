import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { app_routing } from './app.routes';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { AdquirirSeguroComponent } from './components/adquirir-seguro/adquirir-seguro.component';
import { AnticiposComponent } from './components/anticipos/anticipos.component';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { DetalleProductoComponent } from './components/detalle-producto/detalle-producto.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';
import { NominaComponent } from './components/nomina/nomina.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { SegurosComponent } from './components/seguros/seguros.component';
import { VacacionesComponent } from './components/vacaciones/vacaciones.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperaComponent } from './components/recupera/recupera.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { FooterloginComponent } from './components/footerlogin/footerlogin.component';
import { ControlMessagesComponent } from './control-messages.component';
import { ValidationService } from './validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    TopbarComponent,
    AdquirirSeguroComponent,
    AnticiposComponent,
    AsistenciaComponent,
    BeneficiosComponent,
    ContactoComponent,
    DetalleProductoComponent,
    MisPedidosComponent,
    NominaComponent,
    PrestamosComponent,
    ProductosComponent,
    SegurosComponent,
    VacacionesComponent,
    LoginComponent,
    RecuperaComponent,
    RegistroComponent,
    PrincipalComponent,
    FooterloginComponent,
    ControlMessagesComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    app_routing ,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
