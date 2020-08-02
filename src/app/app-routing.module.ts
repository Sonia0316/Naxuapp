import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  HomeComponent,
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
} from './components/index.paginas';
import { OtpComponent } from './components/otp/otp.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'adquirirseguro', component: AdquirirSeguroComponent },
  { path: 'anticipos', component: AnticiposComponent },
  { path: 'asistencia', component: AsistenciaComponent },
  { path: 'beneficios', component: BeneficiosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'mispedidos', component: MisPedidosComponent },
  { path: 'nomina', component: NominaComponent },
  { path: 'prestamos', component: PrestamosComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'detalle-producto/:idProducto', component: DetalleProductoComponent },
  { path: 'seguros', component: SegurosComponent },
  { path: 'vacaciones', component: VacacionesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recupera', component: RecuperaComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
