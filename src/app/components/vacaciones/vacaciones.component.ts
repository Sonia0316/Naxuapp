import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
})
export class VacacionesComponent {
  public readonly availableDays = 10;
  public moment = moment;
  public totalDays = 0;
  public loading = false;
  private readonly userRFC = 'BAGN900415TIA';

  constructor(private readonly httpClient: HttpClient) {}

  public initialChangeDate(initialDate, finalDate) {
    if (
      finalDate.value &&
      !this.moment(initialDate.value).isBefore(finalDate.value)
    ) {
      finalDate.value = '';
    }
  }

  public async calcHolidays(initialDateValue: string, finalDateValue: string) {
    if (initialDateValue && finalDateValue) {
      this.loading = true;
      try {
        const dataCalc = (await this.httpClient
          .post(
            'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/vacaciones/calcula_dias',
            {
              start: initialDateValue,
              end: finalDateValue,
            }
          )
          .toPromise()) as any;
        this.totalDays =
          Number(dataCalc.codigo) === 200
            ? Number(dataCalc.total_dias) || 0
            : 0;
      } catch (error) {
        console.log(error);
        this.totalDays = 0;
      } finally {
        this.loading = false;
      }
    } else {
      this.totalDays = 0;
    }
  }

  public async registerHolidays(
    initialDateValue: string,
    finalDateValue: string
  ) {
    this.loading = true;
    try {
      const resultCode = ((await this.httpClient
        .post(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/vacaciones',
          {
            t12_fechas_inicio: initialDateValue,
            t12_fecha_fin: finalDateValue,
            t12_usuario: this.userRFC,
          }
        )
        .toPromise()) as any).codigo;
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
