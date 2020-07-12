import { Component } from '@angular/core';
import { Router } from 'node_modules/@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  constructor(public router: Router) {}
  shouldShow() {
    return !(
      this.router.url === '/login' ||
      this.router.url === '/registro' ||
      this.router.url === '/'
    );
  }
  public toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  public sideBarClose() {
    document.getElementById('sidebar').classList.remove('active');
  }
}
