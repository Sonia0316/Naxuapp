import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DataProvider } from 'src/app/providers/data.provider';
import { environment } from '@envs/environment';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
})
export class MisPedidosComponent implements OnInit {
  public loading = false;
  public status: string;
  public pedidos = [];
  public moment = moment;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    const RFC = this.dataProvider.getDataNaxu().RFCEmpleado;
    try {
      this.pedidos = ((await this.httpClient
        .get(`${environment.mainUrl}/ventas/webapp/${RFC}`)
        .toPromise()) as any).body;
      if (Array.isArray(this.pedidos) && this.pedidos.length) {
        this.status = 'complete';
      } else {
        this.status = 'empty';
      }
    } catch (error) {
      console.log(error);
      this.status = 'error';
    } finally {
      this.loading = false;
    }
  }
}
