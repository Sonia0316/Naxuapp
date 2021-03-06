import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from 'node_modules/@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';
import { environment } from '@envs/environment';

declare var paypal;

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss'],
})
export class DetalleProductoComponent implements OnInit {
  public loading = false;
  public status: string;

  public salarioQuincenal: number;
  private userRFC: string;

  public dataProduct: any;

  public quantityStock = [];
  public quantity: number;
  public paysAvailable = [];
  public checkToPayByPayroll: boolean;
  public payAvailableSelected;

  public block: boolean;
  public dataNaxu: DataModel;

  public formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  @ViewChild('paypal') paypalElement: ElementRef;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    this.dataNaxu = this.dataProvider.getDataNaxu();
    this.salarioQuincenal = Number(this.dataNaxu.sueldoNeto);
    this.userRFC = this.dataNaxu.RFCEmpleado;
    try {
      let blockData = (await this.httpClient
        .get(
          `${environment.mainUrl}/valida_prestamos/${this.dataNaxu.RFCEmpleado}`
        )
        .toPromise()) as any;

      blockData = blockData.body
        ? blockData.body.find((element) => Number(element.status))
        : null;
      this.block = blockData ? true : false;

      const idProducto = Number(this.route.snapshot.paramMap.get('idProducto'));
      this.dataProduct = ((await this.httpClient
        .get(`${environment.mainUrl}/productos/${idProducto}`)
        .toPromise()) as any).response.lista[0];
      this.dataProduct.imagenes = ((await this.httpClient
        .get(`${environment.mainUrl}/productos/detalle/${idProducto}`)
        .toPromise()) as any).response.lista.filter(
        (element) => element.c03_estatus === 'Activo'
      );
      const stock = Number(this.dataProduct.c02_stock);
      if (this.dataProduct.c02_estatus === 'Activo' && stock) {
        this.quantityStock = Array(5)
          .fill(0)
          .map((x, i) => (stock >= i + 1 ? i + 1 : undefined))
          .filter((item) => item);
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
    this.status = 'complete';
    setTimeout(async () => {
      await this.paypalCheckoutRender();
      this.loading = false;
    });
  }
  public getPrice(price: string) {
    return this.formatter.format(Number(price) * this.quantity);
  }
  public async checkToPayByPayrollData(): Promise<void> {
    try {
      const result = ((await this.httpClient
        .post(`${environment.mainUrl}/calculadora`, {
          producto: this.dataProduct.c02id,
          cantidad: this.quantity,
          metodopago: 'NOMINA',
          quincenas: '',
          salario: this.salarioQuincenal,
        })
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
              .post(`${environment.mainUrl}/calculadora`, {
                producto: this.dataProduct.c02id,
                cantidad: this.quantity,
                metodopago: 'DIFERIDO',
                quincenas: i + 1,
                salario: this.salarioQuincenal,
              })
              .toPromise() as any;
          })
      );
      this.paysAvailable = results
        .map((response, i) => {
          return Number(response.codigo) === 200
            ? { quantity: i + 1, price: response.diferido }
            : undefined;
        })
        .filter((pay) => pay);
    } catch (error) {
      console.log(error);
      this.paysAvailable = [];
    }
  }
  public getPaymentFormated(quantity) {
    const value = this.paysAvailable.find(
      (pay) => pay.quantity === Number(quantity)
    );
    return this.formatter.format(Number(value.price));
  }
  public async buyProduct({
    payment,
    payments = 1,
    paypalOrder,
  }: {
    payment: 'NOMINA' | 'DIFERIDO' | 'TDC';
    payments?: number;
    paypalOrder?: string;
  }) {
    this.loading = true;
    let data: any = {
      usuario: this.userRFC,
      producto: this.dataProduct.c02id,
      cantidad: this.quantity,
      salario: this.salarioQuincenal,
    };
    if (payment === 'NOMINA') {
      data = {
        ...data,
        metodo_pago: 'NOMINA',
        quincenas: '',
      };
    } else if (payment === 'DIFERIDO') {
      data = {
        ...data,
        metodo_pago: 'DIFERIDO',
        quincenas: payments,
      };
    } else {
      data = {
        ...data,
        metodo_pago: 'TDC',
        quincenas: '',
        foliopaypal: paypalOrder,
      };
    }
    try {
      await this.httpClient
        .post(`${environment.mainUrl}/registraventa`, data)
        .toPromise();
      await this.httpClient
        .post(`${environment.mainUrl}/emailbackoffice`, {
          empresa: this.dataNaxu.empresa,
          asunto: 'Compra en tienda virtual',
          mensaje: `El usuario ${this.dataNaxu.RFCEmpleado} realiz?? la compra del producto con identificador ${this.dataProduct.c02id} por el m??todo de pago ${data.metodo_pago}`,
          grupo: 'TIENDA',
        })
        .toPromise();
      document.getElementById('showModalExitoSolicitud').click();
    } catch (error) {
      console.log(error);
      document.getElementById('showModalErrorSolicitud').click();
    } finally {
      this.loading = false;
    }
  }
  public async paypalCheckoutRender() {
    const originalPrice = Number(this.dataProduct.c02_precio);
    const total = this.quantity * originalPrice;
    const tmp = document.createElement('DIV');
    tmp.innerHTML = this.dataProduct.c02_descripcion;
    const description = tmp.textContent || tmp.innerText || '';
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          this.loading = true;
          return actions.order.create({
            purchase_units: [
              {
                description: `Compra de ${this.dataProduct.c02_titulo}`,
                amount: {
                  currency_code: 'MXN',
                  value: total,
                  breakdown: {
                    item_total: {
                      currency_code: 'MXN',
                      value: total,
                    },
                  },
                },
                items: [
                  {
                    name: this.dataProduct.c02_titulo,
                    unit_amount: {
                      currency_code: 'MXN',
                      value: originalPrice,
                    },
                    quantity: this.quantity,
                    description,
                    sku: this.dataProduct.c02id,
                  },
                ],
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          try {
            const generateOrder = await actions.order.capture();
            if (generateOrder.status === 'COMPLETED') {
              return this.buyProduct({
                payment: 'TDC',
                paypalOrder: data.orderID,
              });
            }
          } catch (error) {
            console.error(error);
          }
          return document.getElementById('showModalErrorSolicitud').click();
        },
        onError: (err) => {
          console.log(err);
          this.loading = false;
        },
        onCancel: (data) => {
          this.loading = false;
        },
      })
      .render(this.paypalElement.nativeElement);
  }
}
