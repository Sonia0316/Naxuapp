import { RouterModule, Routes } from '@angular/router';

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
	RegistroComponent
} from './components/index.paginas';

const app_routes: Routes = [
	{path: '',component: LoginComponent},
	{path: 'home',component: HomeComponent},
	{path: 'adquirirseguro',component: AdquirirSeguroComponent},
	{path: 'anticipos',component: AnticiposComponent},
	{path: 'asistencia',component: AsistenciaComponent},
	{path: 'beneficios',component: BeneficiosComponent},
	{path: 'contacto',component: ContactoComponent},
	{path: 'detalleproducto',component: DetalleProductoComponent},
	{path: 'mispedidos',component: MisPedidosComponent},
	{path: 'nomina',component: NominaComponent},
	{path: 'prestamos',component: PrestamosComponent},
	{path: 'productos',component: ProductosComponent},
	{path: 'seguros',component: SegurosComponent},
	{path: 'vacaciones',component: VacacionesComponent},
	{path: 'login',component: LoginComponent},
	{path: 'recupera',component: RecuperaComponent},
	{path: 'registro',component: RegistroComponent},
	{path: '**',pathMatch: 'full', redirectTo: 'home'}
];

export const app_routing = RouterModule.forRoot(app_routes);
