import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
})
export class MisPedidosComponent implements OnInit {
  public loading = false;
  public status: string;
  public pedidos = [];
  constructor(private readonly httpClient: HttpClient) {}
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    // Cambiar el RFC
    const RFC = 'BAGN900415TIA';
    try {
      this.pedidos = ((await this.httpClient
        .get(
          `https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/ventas/webapp/${RFC}`
        )
        .toPromise()) as any).body;
      if (this.pedidos.length) {
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
