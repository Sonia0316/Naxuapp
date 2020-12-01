import { Component, HostListener, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { PromptComponent } from '../prompt/prompt.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { DataProvider } from 'src/app/providers/data.provider';
import { DataModel } from 'src/app/models/data.interface';
import { environment } from '@envs/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  deferredPrompt: any;
  showButton = false;
  public loading = false;
  public status = 'Not available';
  private userRFC: string;
  public sliderData: Array<any>;
  public dataNaxu: DataModel;
  public lendAvailable = true;
  public availableDays: number;

  constructor(
    private readonly platform: Platform,
    private readonly bottomSheet: MatBottomSheet,
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    e.preventDefault();
    if (this.platform.ANDROID) {
      this.deferredPrompt = e;
      this.showButton = true;
    }
  }
  public async ngOnInit(): Promise<void> {
    this.loading = true;
    this.dataNaxu = this.dataProvider.getDataNaxu();
    this.userRFC = this.dataNaxu.RFCEmpleado;
    try {
      const validaPrestamos = (await this.httpClient
        .get(
          `${environment.mainUrl}/valida_prestamos/${this.dataNaxu.RFCEmpleado}`
        )
        .toPromise()) as any;
      this.lendAvailable = !!validaPrestamos.body.find(
        (element) => element.credito === 'PRESTAMO' && !Number(element.status)
      );
      this.availableDays =
        Number(validaPrestamos.diasVacacionesDisponibles) ?? 0;
      this.sliderData = ((await this.httpClient
        .get(`${environment.mainUrl}/carrusel/status/Activo`)
        .toPromise()) as any).body
        .filter((element) => element.t13_status === 'Activo')
        .sort((a, b) => Number(a.t13_orden) - Number(b.t13_orden));
      if (this.sliderData.length) {
        this.status = 'Available';
        return;
      }
      this.status = 'Not available';
    } catch (error) {
      console.log(error);
      this.status = 'Not available';
    } finally {
      this.loading = false;
      if (this.platform.IOS) {
        const isInStandaloneMode =
          'standalone' in window.navigator && window.navigator['standalone'];
        if (!isInStandaloneMode) {
          this.openPromptComponent('ios');
        }
      }
    }
  }
  public async addToHomeScreen() {
    this.deferredPrompt.prompt();
    const choiceResult = await this.deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      this.deferredPrompt = null;
      this.showButton = false;
    }
  }
  private openPromptComponent(mobileType: 'ios' | 'android') {
    this.bottomSheet.open(PromptComponent, {
      data: { mobileType, promptEvent: this.deferredPrompt },
    });
  }
  public async toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
  public openModalCredit() {
    document.getElementById('showModalInfoSolicitud').click();
  }
}
