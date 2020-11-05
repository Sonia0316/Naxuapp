import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CheckUnauthenticationGuard } from './guards/check-unauthentication.guard';
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
  HipotecariosComponent,
  OtpComponent,
} from './components/index.paginas';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [CheckUnauthenticationGuard],
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      { path: 'registro', component: RegistroComponent },
      { path: 'otp', component: OtpComponent },
      { path: 'recupera', component: RecuperaComponent },
    ],
  },
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'adquirirseguro', component: AdquirirSeguroComponent },
      { path: 'anticipos', component: AnticiposComponent },
      { path: 'hipotecarios', component: HipotecariosComponent },
      { path: 'asistencia', component: AsistenciaComponent },
      { path: 'beneficios', component: BeneficiosComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'mispedidos', component: MisPedidosComponent },
      { path: 'nomina', component: NominaComponent },
      { path: 'prestamos', component: PrestamosComponent },
      { path: 'productos', component: ProductosComponent },
      {
        path: 'detalle-producto/:idProducto',
        component: DetalleProductoComponent,
      },
      { path: 'seguros', component: SegurosComponent },
      { path: 'vacaciones', component: VacacionesComponent },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
