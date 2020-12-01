import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';
import { environment } from '@envs/environment';
@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
})
export class VacacionesComponent implements OnInit {
  public availableDays = 0;
  public dataNaxu: DataModel;
  public moment = moment;
  public totalDays = 0;
  public loading = false;
  private userRFC: string;
  public status: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}

  public async ngOnInit(): Promise<void> {
    this.dataNaxu = this.dataProvider.getDataNaxu();
    this.userRFC = this.dataNaxu.RFCEmpleado;
    this.loading = true;
    try {
      const days: number = Number(
        ((await this.httpClient
          .get(
            `${environment.mainUrl}/valida_prestamos/${this.dataNaxu.RFCEmpleado}`
          )
          .toPromise()) as any).diasVacacionesDisponibles
      );
      if (days) {
        this.availableDays = days;
        this.status = 'Available';
        return;
      }
      this.status = 'NotAvailable';
    } catch (error) {
      console.log(error);
      this.status = 'Error';
    } finally {
      this.loading = false;
    }
  }

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
          .post(`${environment.mainUrl}/vacaciones/calcula_dias`, {
            start: initialDateValue,
            end: finalDateValue,
          })
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
        .post(`${environment.mainUrl}/vacaciones`, {
          t12_fechas_inicio: initialDateValue,
          t12_fecha_fin: finalDateValue,
          t12_usuario: this.userRFC,
        })
        .toPromise()) as any).codigo;
      if (Number(resultCode) === 200) {
        await this.httpClient
          .post(`${environment.mainUrl}/emailbackoffice`, {
            asunto: 'Registro vacaciones',
            mensaje: `El usuario ${this.userRFC} desea registar sus vacaciones`,
            grupo: 'VACACIONES',
          })
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
