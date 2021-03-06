import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestRegistro } from './RequestRegistro';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@envs/environment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  url = `${environment.mainUrl}/findusersbyrfc`;
  userForm: FormGroup;
  response: any;
  public loading = false;
  public enterprises = [];
  constructor(
    private formBuilder: FormBuilder,
    public http: HttpClient,
    private router: Router,
  ) {
    this.userForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        email: ['', [Validators.required, ValidationService.emailValidator]],
        rfc: ['', Validators.required],
        employee: ['', Validators.required],
        enterprise: ['', Validators.required],
      },
      {
        validator: ValidationService.MatchPassword,
      }
    );
  }

  CheckRegister() {
    if (this.userForm.dirty && this.userForm.valid) {
      this.loading = true;
      const request = {
        rfc: this.userForm.value.rfc,
        password: this.userForm.value.password,
        status: 'Activo',
        email: this.userForm.value.email,
        empleado: this.userForm.value.employee,
        empresaid: this.userForm.value.enterprise,
      };
      this.postRegister(request).subscribe(
        (res) => {
          if (Number(res.body.codigo) === 200) {
            this.router.navigate(['/']);
          } else {
            console.error(res.body.descripcion);
            document.getElementById('showModalErrorSolicitud').click();
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
          document.getElementById('showModalErrorSolicitud').click();
        },
        () => {
          this.loading = false;
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
  public async ngOnInit() {
    this.loading = true;
    try {
      const responseEnterprises = (await this.http
        .get(
          `${environment.mainUrl}/empresa`
        )
        .toPromise()) as any;
      if (Array.isArray(responseEnterprises.body) && responseEnterprises.body.length) {
        this.enterprises = responseEnterprises.body;
      }
    } finally {
      this.loading = false;
    }

  }
}
