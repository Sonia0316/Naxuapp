import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestContacto } from './RequestContacto';
import { ResponseContacto } from './ResponseContacto';
import { Observable } from 'rxjs';
import { DataModel } from 'src/app/models/data.interface';
import { DataProvider } from 'src/app/providers/data.provider';
import { environment } from '@envs/environment';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
})
export class ContactoComponent implements OnInit {
  url = `${environment.mainUrl}/contacto`;
  userForm: FormGroup;
  public dataNaxu: DataModel;
  response: any;
  public loading = false;
  public subjectCharacters = 50;
  public availableSubjectCharacters = 50;
  public asuntoData = '';

  constructor(
    private formBuilder: FormBuilder,
    public http: HttpClient,
    private readonly dataProvider: DataProvider
  ) {
    this.userForm = this.formBuilder.group({
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required]],
    });
  }

  SendMessage() {
    if (this.userForm.dirty && this.userForm.valid) {
      this.loading = true;
      this.postLogin({
        asunto: this.userForm.value.asunto,
        mensaje: `El usuario ${this.dataNaxu.RFCEmpleado} ha enviado el siguiente mensaje: ${this.userForm.value.mensaje}`,
      }).subscribe(
        (res) => {
          document.getElementById('showModalExitoSolicitud').click();
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
        },
        () => {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          this.loading = false;
        }
      );
    }
  }
  public async ngOnInit() {
    this.dataNaxu = this.dataProvider.getDataNaxu();
  }

  postLogin(
    login: RequestContacto
  ): Observable<HttpResponse<ResponseContacto>> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<ResponseContacto>(this.url, login, {
      headers: httpHeaders,
      observe: 'response',
    });
  }
}
