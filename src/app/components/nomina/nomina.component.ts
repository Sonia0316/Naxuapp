import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataModel } from 'src/app/models/data.interface';
import { DataProvider } from 'src/app/providers/data.provider';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
})
export class NominaComponent implements OnInit {
  public years: Array<number>;
  public yearSelected: number | '' = '';
  public type: number | '' = '';
  public step: number | '' = '';
  public month: number | '' = '';
  public loading = false;
  public dataNaxu: DataModel;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}
  public async ngOnInit(): Promise<void> {
    const actualYear = new Date().getFullYear();
    this.years = [...Array(5).keys()].map((year) => actualYear - year);
    this.dataNaxu = this.dataProvider.getDataNaxu();
  }
  public async downloadReceipt() {
    this.loading = true;
    try {
      const response = (await this.httpClient
        .post(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/recibos',
          {
            rfc: this.dataNaxu.RFCEmpleado,
            anio: this.yearSelected,
            periodo: +this.month * +this.type + +this.step,
            tipo: '001',
            codigo: 'ORDINARI',
          }
        )
        .toPromise()) as any;
      if (
        response.body &&
        response.body.pdf &&
        response.body.pdf !== 'No se encontró el archivo PDF'
      ) {
        const linkSource = `data:application/pdf;base64,${response.body.pdf}`;
        const downloadLink = document.createElement('a');
        const fileName = `Recibo de Nomina ${this.getNamePeriod()} Periodo de ${this.getMonth(
          +this.month
        )} del ${this.yearSelected}.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
    document.getElementById('showModalErrorSolicitud').click();
  }
  private getMonth(month: number) {
    switch (month) {
      case 1:
        return 'Enero';
      case 2:
        return 'Febrero';
      case 3:
        return 'Marzo';
      case 4:
        return 'Abril';
      case 5:
        return 'Mayo';
      case 6:
        return 'Junio';
      case 7:
        return 'Julio';
      case 8:
        return 'Agosto';
      case 9:
        return 'Septiembre';
      case 10:
        return 'Octubre';
      case 11:
        return 'Noviembre';
      case 12:
        return 'Diciembre';
    }
  }
  private getNamePeriod(): string {
    switch (true) {
      case +this.type === 1 && +this.step === 0:
      case +this.type === 2 && +this.step === -1:
      case +this.type === 4 && +this.step === -3:
        return 'Primer';
      case +this.type === 2 && +this.step === 0:
      case +this.type === 4 && +this.step === -2:
        return 'Segundo';
      case +this.type === 4 && +this.step === -1:
        return 'Tercer';
      case +this.type === 4 && +this.step === 0:
        return 'Cuarto';
      default:
        return '';
    }
  }
}
