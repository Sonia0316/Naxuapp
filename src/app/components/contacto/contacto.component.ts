import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestContacto } from './RequestContacto';
import { ResponseContacto } from './ResponseContacto';
import { Observable, of } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html'
})
export class ContactoComponent implements OnInit {
  url = "https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/contacto";
  userForm: any;
  response: any;
  //import { Routes, Router } from 'node_modules/@angular/router';
  constructor(private formBuilder:FormBuilder,public http:HttpClient,private router: Router) { 

    this.userForm = this.formBuilder.group({
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required]]
    });

    console.log(this.userForm);

  }

  SendMessage() {
    if (this.userForm.dirty && this.userForm.valid) {

      let request = {asunto: this.userForm.value.asunto, 
        mensaje: this.userForm.value.mensaje}
        this.postLogin(request).subscribe(res => { 
          let logincl: ResponseContacto = res.body;
        
        //  console.log(logincl.email);
          console.log(res.headers.get('Content-Type'));	        
            alert(res.body.descripcion); 
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
  ngOnInit(): void {
    
  }

  postLogin(login: RequestContacto): Observable<HttpResponse<ResponseContacto>> {
    let httpHeaders = new HttpHeaders({    
         'Content-Type' : 'application/json'
    });    
    return this.http.post<ResponseContacto>(this.url, login,
        {
          headers: httpHeaders,
          observe: 'response'
        }
    );
}    

}
