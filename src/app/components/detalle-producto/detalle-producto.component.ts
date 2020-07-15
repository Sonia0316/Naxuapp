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

  public readonly salarioQuincenal = 300;
  public dataProduct: any;

  public quantityStock = [];
  public quantity: number;
  public paysAvailable = [];
  public checkToPayByPayroll: boolean;

  public formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

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
        .toPromise()) as any).response.lista[0];
      if (
        this.dataProduct['c02_estatus'] === 'Activo' &&
        Number(this.dataProduct['c02_stock'])
      ) {
        this.quantityStock = Array(5)
          .fill(0)
          .map((x, i) => i + 1);
        this.quantity = 1;
        await this.changeQuantity();
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
  public async changeQuantity(): Promise<void> {
    this.loading = true;
    this.status = 'loading';
    await Promise.all([
      this.checkToPayByPayrollData(),
      this.getPaysAvailable(),
    ]);
    this.loading = false;
    this.status = 'complete';
  }
  public getPrice(price: string) {
    return this.formatter.format(Number(price) * this.quantity);
  }
  public async checkToPayByPayrollData(): Promise<void> {
    try {
      const result = ((await this.httpClient
        .post(
          `https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/calculadora`,
          {
            producto: this.dataProduct['c02id'],
            cantidad: this.quantity,
            metodopago: 'NOMINA',
            quincenas: '',
            salario: this.salarioQuincenal,
          }
        )
        .toPromise()) as any).codigo;
      this.checkToPayByPayroll = Number(result) === 200;
    } catch (error) {
      console.log(error);
      this.checkToPayByPayroll = false;
    }
  }
  public async getPaysAvailable(): Promise<void> {
    try {
      const results = await Promise.all(
        Array(12)
          .fill(0)
          .map((x, i) => {
            return this.httpClient
              .post(
                `https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/calculadora`,
                {
                  producto: this.dataProduct['c02id'],
                  cantidad: this.quantity,
                  metodopago: 'DIFERIDO',
                  quincenas: i + 1,
                  salario: this.salarioQuincenal,
                }
              )
              .toPromise() as any;
          })
      );
      this.paysAvailable = results
        .map((response, i) =>
          Number(response.codigo) === 200 ? i + 1 : undefined
        )
        .filter((pay) => pay !== undefined);
    } catch (error) {
      console.log(error);
      this.paysAvailable = [];
    }
  }
}
