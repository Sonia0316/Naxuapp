import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  constructor(
    private readonly router: Router,
    private readonly dataProvider: DataProvider
  ) {}

  public routeSubscription: Subscription;
  public mainText: string;
  public dataNaxu: DataModel;
  public logos;
  public async ngOnInit(): Promise<void> {
    this.routeSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.mainText = this.getTitle(event.url);
      }
    });
    this.dataNaxu = this.dataProvider.getDataNaxu();
    this.logos = this.dataProvider.logos;
  }
  public shouldShow() {
    switch (this.router.url) {
      case '/recupera':
      case '/registro':
      case '/otp':
      case '/':
        return false;
      default:
        return true;
    }
  }
  public toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  public sideBarEvent() {
    document.getElementById('sidebar').classList.toggle('active');
    this.toTop();
  }
  public sideBarClose() {
    document.getElementById('sidebar').classList.remove('active');
  }
  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
  public getTitle(url: string): string {
    switch (true) {
      case url === '/hipotecarios':
        return 'Créditos hipotecarios';
      case url === '/nomina':
        return 'Recibos de Nómina';
      case url === '/prestamos':
        return 'Préstamos';
      case url === '/productos':
        return 'Productos';
      case url === '/adquirirseguro':
        return 'Adquirir seguro';
      case url === '/anticipos':
        return 'Anticipos';
      case url === '/beneficios':
        return 'Beneficios';
      case url === '/contacto':
        return 'Contacto';
      case url === '/seguros':
        return 'Mis seguros';
      case url === '/vacaciones':
        return 'Vacaciones';
      case url === '/mispedidos':
        return 'Mis Pedidos';
      case url === '/asistencia':
        return 'Asistencia';
      case url.includes('/detalle-producto/'):
        return 'Detalle del producto';
      default:
        return '¡Bienvenido!';
    }
  }
}
