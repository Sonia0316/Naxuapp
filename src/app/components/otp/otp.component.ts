import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  public userForm: FormGroup;
  public loading = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly httpClient: HttpClient
  ) {}
  public ngOnInit(): void {
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
        console.log('vista otp');
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
