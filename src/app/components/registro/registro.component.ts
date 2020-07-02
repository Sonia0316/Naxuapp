import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestRegistro } from './RequestRegistro';
import { ResponseRegistro } from './ResponseRegistro';
import { Observable, of } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  url = "https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/findusersbyrfc";
  userForm: any;
  response: any;
  constructor(private formBuilder:FormBuilder,public http:HttpClient,private router: Router) { 

    this.userForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    
      email: ['', [Validators.required, ValidationService.emailValidator]],
      rfc: ['', Validators.required]
    }, {
      validator: ValidationService.MatchPassword // your validation method
    })

    console.log(this.userForm);
  }

  ngOnInit(): void {
  }

  CheckRegister() {
    if (this.userForm.dirty && this.userForm.valid) {

      let request = {rfc: this.userForm.value.rfc, 
        password: this.userForm.value.password,status: "Activo",email:this.userForm.value.email}
       
        this.postRegister(request).subscribe(res => { 
          let Registrocl: ResponseRegistro = res.body;
        
          console.log(res.headers.get('Content-Type'));	
          if (res.body.codigo=='200')
          {
            //window.localStorage.setItem('rfc',JSON.stringify(res.body.rfc));
            //window.localStorage.setItem('rfc', JSON.stringify(res.body.rfc));
            //window.localStorage.setItem('email', JSON.stringify(res.body.email));
            alert(res.body.descripcion);
            this.router.navigate(['./login'])
          .then(() => {
            window.location.reload();
          });
          }
          else{

            alert(res.body.descripcion); 
          }

        
        },(err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            //A client-side or network error occurred.				 
            console.log('An error occurred:', err.error.message);
            alert('An error occurred:'  + err.error.message);  

          } else {
            //Errores 404, 500 etc.				 
            console.log('Backend returned status code: ', err.status);
            alert('status code: '  + JSON.stringify(err.status));  
            console.log('Response body:', err.message);
            alert('Response body:' + JSON.stringify(err.message));  
          }
        }
     );
      
   
      



    }
  }

  
  postRegister(login: RequestRegistro): Observable<HttpResponse<ResponseRegistro>> {
    let httpHeaders = new HttpHeaders({    
         'Content-Type' : 'application/json'
    });    
    return this.http.post<ResponseRegistro>(this.url, login,
        {
          headers: httpHeaders,
          observe: 'response'
        }
    );
}    

}
