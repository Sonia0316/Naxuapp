import { Component, OnInit } from '@angular/core';
import { Router } from 'node_modules/@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}

  public dataNaxu: DataModel;
  public logos;
  public async ngOnInit(): Promise<void> {
    this.dataNaxu = this.dataProvider.getDataNaxu();
    try {
      this.logos = ((await this.httpClient
        .get('https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/logos')
        .toPromise()) as any).body.find(
        (element) => element.c09_status === 'Activo'
      );
    } catch (error) {
      console.log(error);
    }
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
}
