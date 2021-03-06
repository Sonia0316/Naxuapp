import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataModel } from 'src/app/models/data.interface';
import { DataProvider } from 'src/app/providers/data.provider';
import { environment } from '@envs/environment';

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
  public typePeriod = {
    "MENSUAL": 1,
    "QUINCENAL": 2,
    "SEMANAL": 4,
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) { }

  public async ngOnInit(): Promise<void> {
    const actualYear = new Date().getFullYear();
    const years = [];
    for (let index = 2020; index <= actualYear; index++) {
      years.push(index);
    }
    this.years = [...years];
    this.dataNaxu = this.dataProvider.getDataNaxu();
    const nomina = this.dataNaxu.periodicidad.toUpperCase();
    this.type = this.typePeriod[nomina] || '';
  }
  public async downloadReceipt() {
    this.loading = true;
    try {
      const response = (await this.httpClient
        .post(`${environment.mainUrl}/recibos`, {
          rfc: this.dataNaxu.RFCEmpleado,
          anio: this.yearSelected,
          periodo: +this.month * +this.type + +this.step,
          tipo: '001', // ID Nomina
          codigo: 'ORDINARI',
        })
        .toPromise()) as any;
      if (
        response.body &&
        response.body.pdf &&
        response.body.pdf !== 'No se encontrĂ³ el archivo PDF'
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
