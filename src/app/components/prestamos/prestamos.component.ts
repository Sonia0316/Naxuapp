import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';
@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.scss'],
})
export class PrestamosComponent implements OnInit, AfterContentChecked {
  public dataNaxu: DataModel;
  public maxAmountAvailable = 0;
  public maxPeriods = 0;
  public minAmountAvailable = 0;
  public minPeriods = 1;
  public stepPeriod = 0;
  public startDate: string;

  public readonly moment = moment;
  public readonly Math = Math;
  public readonly Number = Number;

  public loading = false;
  public status: string;
  private readonly creditType = 'CREDITO NOMINA';
  public mainData;
  public lendData;

  public inputPeriod;
  public inputAmount;

  public blockDetail: string;
  public salary: number;

  @ViewChild('dateRange') dateRangeRef: ElementRef;
  @ViewChild('amountRange') amountRangeRef: ElementRef;

  public formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  constructor(
    private readonly httpClient: HttpClient,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly dataProvider: DataProvider
  ) {}
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    this.dataNaxu = this.dataProvider.getDataNaxu();
    this.startDate = this.dataNaxu.antiguedad;
    this.minAmountAvailable = Number(this.dataNaxu.montoMinimoPrestamo);
    this.salary = Number(this.dataNaxu.sueldoNeto);
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
              'No puedes pedir un préstamo porque tienes una compra activa vía nomina';
            break;
          case 'DIFERIDO':
            this.blockDetail =
              'No puedes pedir un préstamo porque tienes una compra activa en pagos diferidos';
            break;
          case 'ADELANTO':
            this.blockDetail =
              'No puedes pedir un préstamo porque tienes anticipo activo';
            break;
          case 'PRESTAMO':
            this.blockDetail =
              'No puedes pedir un préstamo porque ya cuentas con uno activo';
            break;
          default:
            this.blockDetail =
              'No puedes pedir un préstamo porque tienes un servicio activo';
            break;
        }
        this.status = 'Block';
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
        this.maxAmountAvailable = Number(this.dataNaxu.montoMaximoPrestamo);
        this.maxPeriods = Number(this.dataNaxu.plazoMaximoPrestamo);
        this.minPeriods = Number(this.dataNaxu.plazoMinimoPrestamo);
        const years = this.moment().diff(this.startDate, 'years', true);
        if (years > 1) {
          const calcDec = Math.pow(10, 3);
          this.stepPeriod =
            Math.trunc(((this.minPeriods * 100) / this.maxPeriods) * calcDec) /
            calcDec;
          this.inputPeriod = this.minPeriods;
          this.inputAmount = this.minAmountAvailable;
          this.status = 'Available';
          return;
        }
      }
      this.status = 'Not available';
      return;
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    } finally {
      this.loading = false;
    }
  }
  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public getPeriodRange(dateRangeValue: number) {
    const value = Math.round((dateRangeValue / 100) * this.maxPeriods);
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
            p_antiguedad: this.moment()
              .diff(this.dataNaxu.antiguedad, 'years', true)
              .toFixed(2)
              .toString(),
            p_sueldo_quincenal: this.salary.toString(),
          }
        )
        .toPromise()) as any).response.lista;
      if (Array.isArray(data) && data.length && data[0].totalpagar !== 'None') {
        this.lendData = data[0];
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
            t11_rfc: this.dataNaxu.RFCEmpleado,
            t11_cantidad: value,
            t11_numero_plazos: periods,
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
              asunto: 'Solicitud de prestamo',
              mensaje: `El usuario ${this.dataNaxu.RFCEmpleado} esta solicitando un prestamo`,
              grupo: 'PRESTAMO',
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
  public checkPeriodInput(event) {
    if (/[^0-9]+/.test(event.key)) {
      event.preventDefault();
    }
  }
  public checkAmountInput(event): void {
    event.target.value = event.target.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^0-9,.$]+/g, '');
  }
  public changeInputPeriod() {
    if (
      this.inputPeriod >= this.minPeriods &&
      this.inputPeriod <= this.maxPeriods
    ) {
      const calcDec = Math.pow(10, 3);
      this.dateRangeRef.nativeElement.value =
        Math.trunc(((this.inputPeriod * 100) / this.maxPeriods) * calcDec) /
        calcDec;
    }
  }
  public changeAmountPeriod() {
    if (
      this.inputAmount >= this.minAmountAvailable &&
      this.inputAmount <= this.maxAmountAvailable
    ) {
      this.amountRangeRef.nativeElement.value =
        (this.inputAmount * 100) / this.maxAmountAvailable;
    }
  }
}
