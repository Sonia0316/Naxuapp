import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataProvider } from 'src/app/providers/data.provider';

@Component({
  selector: 'app-recupera',
  templateUrl: './recupera.component.html',
  styleUrls: ['./recupera.component.scss'],
})
export class RecuperaComponent implements OnInit {
  public userForm: FormGroup;
  public loading = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly dataProvider: DataProvider
  ) {}
  public logos;
  public ngOnInit(): void {
    this.logos = this.dataProvider.logos;
    this.userForm = this.formBuilder.group({
      rfc: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
    });
  }
  public async sendData() {
    this.loading = true;
    try {
      const data: any = await this.httpClient
        .post(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/sendotp',
          {
            ...this.userForm.value,
          }
        )
        .toPromise();
      if (Number(data.codigo) === 200) {
        this.router.navigateByUrl('/otp');
      } else {
        document.getElementById('showModalErrorUserNotFound').click();
      }
    } catch (error) {
      console.log(error);
      document.getElementById('showModalErrorSolicitud').click();
    } finally {
      this.loading = false;
    }
  }
}
