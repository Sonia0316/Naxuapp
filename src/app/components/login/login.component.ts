import { Component } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestLogin } from './RequestLogin';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataModel } from 'src/app/models/data.interface';
import { DataProvider } from 'src/app/providers/data.provider';
import { environment } from '@envs/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  url = `${environment.mainUrl}/login`;
  public userForm: FormGroup;
  public loading = false;
  response: any;
  public errorLogin = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly http: HttpClient,
    private readonly router: Router,
    private readonly dataProvider: DataProvider
  ) {
    this.userForm = this.formBuilder.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
    });
  }
  public async CheckUser() {
    if (this.userForm.dirty && this.userForm.valid) {
      this.loading = true;
      const request = {
        email: this.userForm.value.email,
        passw: this.userForm.value.password,
        ipRemota: '127.0.0.1',
      };
      this.postLogin(request).subscribe(
        async (res) => {
          const loginData = res.body;
          if (Number(loginData.codigo) === 200) {
            let logos;
            try {
              logos = ((await this.http
                .get(`${environment.mainUrl}/logos/empresa/${loginData.empresa}`)
                .toPromise()) as any).body.find(
                  (element) => element.c09_status === 'Activo'
                );
            } finally {
              this.dataProvider.logos = logos;
            }
            await this.dataProvider.setDataNaxu(loginData);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            this.router.navigate(['./home']).then(() => {
              window.location.reload();
            });
          } else {
            console.error(res.body.descripcion);
            this.errorLogin = true;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred.
            console.log('An error occurred:', err.error.message);
            alert('An error occurred:' + err.error.message);
          } else {
            // Errores 404, 500 etc.
            console.log('Backend returned status code: ', err.status);
            alert('status code: ' + JSON.stringify(err.status));
            console.log('Response body:', err.message);
            alert('Response body:' + JSON.stringify(err.message));
          }
        },
        () => {
          this.loading = false;
        }
      );
    }
  }

  postLogin(login: RequestLogin): Observable<HttpResponse<DataModel>> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<DataModel>(this.url, login, {
      headers: httpHeaders,
      observe: 'response',
    });
  }
}
