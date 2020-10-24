import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { HttpClient } from '@angular/common/http';
import { DataProvider } from 'src/app/providers/data.provider';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  public otpForm: FormGroup;
  public userForm: FormGroup;
  public loading = false;
  public otpStep = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly dataProvider: DataProvider
  ) {}
  public logos;
  public ngOnInit(): void {
    this.logos = this.dataProvider.logos;
    this.userForm = this.formBuilder.group({
      rfc: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: [
        '',
        [Validators.required, ValidationService.matchValues('password')],
      ],
    });
    this.userForm.controls.password.valueChanges.subscribe(() => {
      this.userForm.controls.passwordConfirm.updateValueAndValidity();
    });
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
  public async sendData() {
    this.loading = true;
    try {
      const data: any = await this.httpClient
        .put(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/findusersbyrfc',
          {
            ...this.userForm.value,
          }
        )
        .toPromise();
      if (Number(data.codigo) === 200) {
        document.getElementById('showModalUpdateSuccess').click();
      } else {
        document.getElementById('showModalErrorUpdatePasswordError').click();
      }
    } catch (error) {
      console.log(error);
      document.getElementById('showModalErrorSolicitud').click();
    } finally {
      this.loading = false;
    }
  }
  public async sendDataOtpData() {
    this.loading = true;
    try {
      const data: any = await this.httpClient
        .post(
          'https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/loginotp',
          {
            ...this.otpForm.value,
          }
        )
        .toPromise();
      if (Number(data.codigo) === 200) {
        this.otpStep = false;
      } else {
        document.getElementById('showModalErrorOtpNotFound').click();
      }
    } catch (error) {
      console.log(error);
      document.getElementById('showModalErrorSolicitud').click();
    } finally {
      this.loading = false;
    }
  }
}
