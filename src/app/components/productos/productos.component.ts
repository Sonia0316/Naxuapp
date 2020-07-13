import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  public loading = false;
  public status: string;
  public productos = [];
  public categorias = [];

  constructor(private readonly httpClient: HttpClient) {}
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      // this.categorias = ((await this.httpClient
      //   .get(
      //     'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/productos/categorias'
      //   )
      //   .toPromise()) as any).response.lista;
      this.productos = ((await this.httpClient
        .get(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/productos'
        )
        .toPromise()) as any).response.lista;
      if (this.productos.length) {
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
