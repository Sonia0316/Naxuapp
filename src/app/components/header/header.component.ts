import { Component } from '@angular/core';
import { Router } from 'node_modules/@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public router: Router) {}

  async DestroySession() {
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('rfc');
    window.localStorage.removeItem('FlagRegistro');
    document.getElementById('sidebarCollapse').click();
    await this.toTop();
    await this.router.navigate(['./login']);
  }

  async adquirirseguro() {
    await this.toTop();
    await this.router.navigate(['./adquirirseguro']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async seguros() {
    await this.toTop();
    await this.router.navigate(['./seguros']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async vacaciones() {
    await this.toTop();
    await this.router.navigate(['./vacaciones']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async beneficios() {
    await this.toTop();
    await this.router.navigate(['./beneficios']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async asistencia() {
    await this.toTop();
    await this.router.navigate(['./asistencia']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async contacto() {
    await this.toTop();
    await this.router.navigate(['./contacto']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async home() {
    await this.toTop();
    await this.router.navigate(['./home']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }

  async prestamos() {
    await this.toTop();
    await this.router.navigate(['./prestamos']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async anticipos() {
    await this.toTop();
    await this.router.navigate(['./anticipos']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async nomina() {
    await this.toTop();
    await this.router.navigate(['./nomina']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async productos() {
    await this.toTop();
    await this.router.navigate(['./productos']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  async mispedidos() {
    await this.toTop();
    await this.router.navigate(['./mispedidos']);
    if (
      window.getComputedStyle(document.getElementById('sidebarCollapse'))
        .display !== 'none'
    ) {
      document.getElementById('sidebarCollapse').click();
    }
  }
  public async toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
