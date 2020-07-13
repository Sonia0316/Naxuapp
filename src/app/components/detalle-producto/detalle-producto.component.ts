import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from 'node_modules/@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
})
export class DetalleProductoComponent implements OnInit {
  public loading = false;
  public status: string;
  public dataProduct: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly httpClient: HttpClient
  ) {}
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      const idProducto = Number(this.route.snapshot.paramMap.get('idProducto'));
      this.dataProduct = ((await this.httpClient
        .get(
          `https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/productos/${idProducto}`
        )
        .toPromise()) as any).response.lista;
      console.log('====================================');
      console.log(this.dataProduct);
      console.log('====================================');

      this.status = 'complete';
    } catch (error) {
      console.log(error);
      this.status = 'error';
    } finally {
      this.loading = false;
    }
  }
}
