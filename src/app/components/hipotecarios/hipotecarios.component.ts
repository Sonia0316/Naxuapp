import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';
import { environment } from '@envs/environment';

@Component({
  selector: 'app-hipotecarios',
  templateUrl: './hipotecarios.component.html',
})
export class HipotecariosComponent implements OnInit {
  public loading = false;
  public dataNaxu: DataModel;
  public mainData;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}

  public async ngOnInit(): Promise<void> {
    this.dataNaxu = this.dataProvider.getDataNaxu();
  }
  public async senmailBackOffice() {
    this.loading = true;
    try {
      await this.httpClient
        .post(`${environment.mainUrl}/emailbackoffice`, {
          asunto: 'Información de Crédito hipotecarios',
          mensaje: `El usuario requiere información de crédito hipotecario:\n
            Nombre: ${this.dataNaxu.nombreEmpleado} ${this.dataNaxu.segundoNombreEmpleado}\n
            Número de seguro social: ${this.dataNaxu.NSS}\n
            RFC: ${this.dataNaxu.RFCEmpleado}\n
            Correo electrónico: ${this.dataNaxu.email}\n
            Teléfono: ${this.dataNaxu.telefonomovil}\n
            Salario Quincenal Neto: ${this.dataNaxu.sueldoNeto}\n
            Salario Quincenal Bruto: ${this.dataNaxu.sueldoBruto}`,
          grupo: 'HIPOTECARIO',
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
}
