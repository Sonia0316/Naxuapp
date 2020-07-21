import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-anticipos',
  templateUrl: './anticipos.component.html',
})
export class AnticiposComponent {
  public readonly salarioQuincenal = 300;
  public readonly interesAnticipo = 0.08;
  public loading = false;
  public formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  constructor(private readonly httpClient: HttpClient) {}
  public async requestAdvancePayment() {
    this.loading = true;
    try {
      await this.httpClient
        .post(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/emailbackoffice',
          {
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
