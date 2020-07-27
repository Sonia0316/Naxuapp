import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
})
export class PrestamosComponent implements OnInit, AfterContentChecked {
  public readonly startDate = '2019-01-01';
  public readonly salarioQuincenal = 300;
  private readonly userRFC = 'BAGN900415TIA';
  public maxAmountAvailable = 0;
  public maxPeriods = 0;
  public readonly minAmountAvailable = this.salarioQuincenal * 0.1;
  public readonly minPeriods = 1;

  public readonly moment = moment;

  public loading = false;
  public status: string;
  private readonly creditType = 'CREDITO NOMINA';
  public mainData;
  public lendData;

  public formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  constructor(
    private readonly httpClient: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
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
        const years = this.moment().diff(this.startDate, 'years', true);
        if (years > 1) {
          switch (true) {
            case years > 1 && years <= 1.5:
              this.maxAmountAvailable = this.salarioQuincenal * 2;
              this.maxPeriods = 3;
              break;
            case years > 1.5 && years <= 2:
              this.maxAmountAvailable = this.salarioQuincenal * 4;
              this.maxPeriods = 4;
              break;
            case years > 2:
              this.maxAmountAvailable = this.salarioQuincenal * 6;
              this.maxPeriods = 6;
              break;
          }
          this.status = 'Available';
          return;
        }
      }
      this.status = 'Not available';
      return;
    } catch (error) {
      console.log(error);
      this.status = 'Not available';
    } finally {
      this.loading = false;
    }
  }
  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public getPeriodRange(dateRangeValue: number) {
    const value = (dateRangeValue / 100) * this.maxPeriods;
    return `${value} ${value > 1 ? 'Quincenas' : 'Quincena'}`;
  }

  public async calcLendData(value: number, periods: number) {
    this.loading = true;
    try {
      const data = ((await this.httpClient
        .post(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/creditos/calculadora',
          {
            p_prestamo: value,
            p_id_tipocredito: this.mainData.c05id,
            p_periodo: periods,
          }
        )
        .toPromise()) as any).response.lista;
      if (Array.isArray(data) && data.length && data[0].totalpagar !== 'None') {
        this.lendData = data[0];
        console.log(this.lendData);
        document.getElementById('showModalInfoSolicitud').click();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  public async registerLendData(value: number, periods: number) {
    this.loading = true;
    try {
      const resultCode = ((await this.httpClient
        .put(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/creditos',
          {
            t11id: '',
            t11_rfc: this.userRFC,
            t11_cantidad: value,
            t11_numero_plazos: periods,
            t11_estatus: '',
            t11_fecha: '',
            t11_idtipocredito: this.mainData.c05id,
          }
        )
        .toPromise()) as any).response.resultCode;
      if (Number(resultCode) === 200) {
        document.getElementById('showModalExitoSolicitud').click();
      } else {
        document.getElementById('showModalErrorSolicitud').click();
      }
    } catch (error) {
      console.log(error);
      document.getElementById('showModalErrorSolicitud').click();
    } finally {
      this.loading = false;
    }
  }
}
