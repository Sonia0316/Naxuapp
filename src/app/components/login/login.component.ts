import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestLogin } from './RequestLogin';
import { ResponseLogin } from './ResponseLogin';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  url = 'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/login';
  userForm: any;
  response: any;

  constructor(
    private formBuilder: FormBuilder,
    public http: HttpClient,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
    });

    console.log(this.userForm);
  }

  public async CheckUser() {
    if (this.userForm.dirty && this.userForm.valid) {
      let request = {
        email: this.userForm.value.email,
        passw: this.userForm.value.password,
        ipRemota: '127.0.0.1',
      };
      this.postLogin(request).subscribe(
        (res) => {
          let logincl: ResponseLogin = res.body;

          //  console.log(logincl.email);
          console.log(res.headers.get('Content-Type'));
          //alert('Respuesta '  + res.body.codigo);
          if (res.body.codigo == '200') {
            //window.localStorage.setItem('rfc',JSON.stringify(res.body.rfc));
            window.localStorage.setItem('rfc', JSON.stringify(res.body.rfc));
            window.localStorage.setItem(
              'email',
              JSON.stringify(res.body.email)
            );
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            this.router.navigate(['./home']).then(() => {
              window.location.reload();
            });
          } else {
            alert(res.body.descripcion);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            //A client-side or network error occurred.
            console.log('An error occurred:', err.error.message);
            alert('An error occurred:' + err.error.message);
          } else {
            //Errores 404, 500 etc.
            console.log('Backend returned status code: ', err.status);
            alert('status code: ' + JSON.stringify(err.status));
            console.log('Response body:', err.message);
            alert('Response body:' + JSON.stringify(err.message));
          }
        }
      );
    }
  }
  ngOnInit(): void {
    let email = window.localStorage.getItem('email');
    if (email) {
      this.router.navigate(['./home']);
    }
  }

  postLogin(login: RequestLogin): Observable<HttpResponse<ResponseLogin>> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<ResponseLogin>(this.url, login, {
      headers: httpHeaders,
      observe: 'response',
    });
  }
  FlagRegistro() {
    window.localStorage.setItem('FlagRegistro', '1');
    this.router.navigate(['./registro']);
  }
  FlagRecupera() {
    window.localStorage.setItem('FlagRecupera', '1');
    //this.router.navigate(['./recupera']);
  }
}
