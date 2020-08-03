import { Component } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestRegistro } from './RequestRegistro';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent {
  url =
    'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/findusersbyrfc';
  userForm: FormGroup;
  response: any;
  constructor(
    private formBuilder: FormBuilder,
    public http: HttpClient,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],

        email: ['', [Validators.required, ValidationService.emailValidator]],
        rfc: ['', Validators.required],
      },
      {
        validator: ValidationService.MatchPassword, // your validation method
      }
    );
  }

  CheckRegister() {
    if (this.userForm.dirty && this.userForm.valid) {
      const request = {
        rfc: this.userForm.value.rfc,
        password: this.userForm.value.password,
        status: 'Activo',
        email: this.userForm.value.email,
      };

      this.postRegister(request).subscribe(
        (res) => {
          if (Number(res.body.codigo) === 200) {
            this.router.navigate(['./login']).then(() => {
              window.location.reload();
            });
          } else {
            console.error(res.body.descripcion);
          }
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
  }

  public postRegister(login: RequestRegistro): Observable<HttpResponse<any>> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(this.url, login, {
      headers: httpHeaders,
      observe: 'response',
    });
  }
}
