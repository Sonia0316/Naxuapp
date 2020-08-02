import { Component, HostListener, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { PromptComponent } from '../prompt/prompt.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
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
  private readonly userRFC = 'BAGN900415TIA';
  public sliderData: Array<any>;
  constructor(
    private readonly platform: Platform,
    private readonly bottomSheet: MatBottomSheet,
    private readonly httpClient: HttpClient
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
    try {
      this.sliderData = ((await this.httpClient
        .get(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/carrusel/status/Activo'
        )
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
        .post(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/emailbackoffice',
          {
            asunto: 'Información de Crédito hipotecarios',
            mensaje: `El usuario ${this.userRFC} requiere información de crédito hipotecario`,
            grupo: 'HIPOTECARIO',
          }
        )
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
