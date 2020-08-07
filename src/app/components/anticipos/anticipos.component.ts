import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';

@Component({
  selector: 'app-anticipos',
  templateUrl: './anticipos.component.html',
})
export class AnticiposComponent implements OnInit {
  public loading = false;
  public dataNaxu: DataModel;
  public status: string;
  private readonly creditType = 'ANTICIPO DE NOMINA';
  public mainData;
  public lendData;
  public Number = Number;

  public salarioQuincenal: number;

  public blockDetail: string;

  public formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });
  constructor(
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}

  public async ngOnInit(): Promise<void> {
    this.loading = true;
    this.dataNaxu = this.dataProvider.getDataNaxu();
    this.salarioQuincenal = Number(this.dataNaxu.sueldoNeto);
    try {
      const blockData = ((await this.httpClient
        .get(
          `https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/valida_prestamos/${this.dataNaxu.RFCEmpleado}`
        )
        .toPromise()) as any).body.find((element) => Number(element.status));
      if (blockData) {
        switch (blockData.credito) {
          case 'NOMINA':
            this.blockDetail =
              'No puedes pedir un anticipo porque tienes una compra activa vía nomina';
            break;
          case 'DIFERIDO':
            this.blockDetail =
              'No puedes pedir un anticipo porque tienes una compra activa en pagos diferidos';
            break;
          case 'ADELANTO':
            this.blockDetail =
              'No puedes pedir un anticipo porque ya cuentas con uno activo';
            break;
          case 'PRESTAMO':
            this.blockDetail =
              'No puedes pedir un anticipo porque tienes un préstamo activo';
            break;
          default:
            this.blockDetail =
              'No puedes pedir un anticipo porque tienes un servicio activo';
            break;
        }
        this.status = 'block';
        return;
      }
      this.mainData = ((await this.httpClient
        .get(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/creditos/tipocredito'
        )
        .toPromise()) as any).response.lista.find(
        (element) =>
          element.c05_descripcion === this.creditType &&
          element.c05_estatus === 'Activo'
      );
      if (this.mainData) {
        const data = ((await this.httpClient
          .post(
            'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/creditos/calculadora',
            {
              p_prestamo: this.salarioQuincenal,
              p_id_tipocredito: this.mainData.c05id,
              p_periodo: '1',
            }
          )
          .toPromise()) as any).response.lista;
        if (
          Array.isArray(data) &&
          data.length &&
          data[0].totalpagar !== 'None'
        ) {
          this.lendData = data[0];
        }
        this.status = 'complete';
        return;
      }
      this.status = 'empty';
      return;
    } catch (error) {
      console.log(error);
      this.status = 'error';
    } finally {
      this.loading = false;
    }
  }

  public async registerLendData() {
    this.loading = true;
    try {
      const resultCode = ((await this.httpClient
        .put(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/creditos',
          {
            t11id: '',
            t11_rfc: this.dataNaxu.RFCEmpleado,
            t11_cantidad: this.salarioQuincenal,
            t11_numero_plazos: '1',
            t11_estatus: 'Pendiente',
            t11_fecha: '',
            t11_idtipocredito: this.mainData.c05id,
          }
        )
        .toPromise()) as any).response.resultCode;
      if (Number(resultCode) === 200) {
        await this.httpClient
          .post(
            'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/emailbackoffice',
            {
              asunto: 'Solicitud de anticipo',
              mensaje: `El usuario ${this.dataNaxu.RFCEmpleado} esta solicitando un anticipo`,
              grupo: 'ANTICIPO',
            }
          )
          .toPromise();
        document.getElementById('showModalExitoSolicitud').click();
        return;
      }
      document.getElementById('showModalErrorSolicitud').click();
    } catch (error) {
      console.log(error);
      document.getElementById('showModalErrorSolicitud').click();
    } finally {
      this.loading = false;
    }
  }
}
