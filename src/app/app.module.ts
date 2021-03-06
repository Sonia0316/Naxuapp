import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxCurrencyModule } from 'ngx-currency';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { ServiceWorkerModule } from '@angular/service-worker';

import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
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
import { ControlMessagesComponent } from './components/resources/control-messages/control-messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalLoadingComponent } from './components/resources/modal-loading/modal-loading.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PromptComponent } from './components/prompt/prompt.component';
import { OtpComponent } from './components/otp/otp.component';

import { SafePipeModule } from 'safe-pipe';
import { DataProvider } from './providers/data.provider';
import { HipotecariosComponent } from './components/hipotecarios/hipotecarios.component';

export function dataProviderFactory(provider: DataProvider) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
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
    ControlMessagesComponent,
    ModalLoadingComponent,
    PromptComponent,
    OtpComponent,
    HipotecariosComponent,
  ],
  imports: [
    HttpClientModule,
    SafePipeModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    MatBottomSheetModule,
    MatIconModule,
    MatButtonModule,
    NgCircleProgressModule.forRoot({
      backgroundStrokeWidth: 0,
      backgroundPadding: 1,
      radius: 50,
      space: 4,
      maxPercent: 100,
      outerStrokeWidth: 10,
      innerStrokeWidth: 0,
      imageHeight: 0,
      imageWidth: 0,
      animationDuration: 300,
      showTitle: false,
      showSubtitle: false,
      showUnits: false,
      showBackground: false,
      showInnerStroke: false,
      startFromZero: false,
    }),
    NgxCurrencyModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    DataProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: dataProviderFactory,
      deps: [DataProvider],
      multi: true,
    },
  ],
})
export class AppModule {}
