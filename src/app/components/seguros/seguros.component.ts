import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataProvider } from 'src/app/providers/data.provider';

@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.component.html',
})
export class SegurosComponent implements OnInit {
  public url: string;
  JsonResp: [];

  constructor(
    private readonly http: HttpClient,
    private dataProvider: DataProvider
  ) {}
  public async ngOnInit(): Promise<void> {
    const dataNaxu = this.dataProvider.getDataNaxu();
    this.url = `https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/seguros/asignacion/${dataNaxu.rfc}`;
    this.getAsignacionesbyRFC();
  }

  getAsignacionesbyRFC() {
    this.getAsignacionSeguro().subscribe(
      (res) => {
        this.JsonResp = JSON.parse(JSON.stringify(res.body.response.lista));
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          alert('An error occurred:' + err.error.message);
        } else {
          console.log('Backend returned status code: ', err.status);
          alert('status code: ' + JSON.stringify(err.status));
          console.log('Response body:', err.message);
          alert('Response body:' + JSON.stringify(err.message));
        }
      }
    );
  }

  private getAsignacionSeguro(): Observable<HttpResponse<any>> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(this.url, {
      headers: httpHeaders,
      observe: 'response',
    });
  }
}
