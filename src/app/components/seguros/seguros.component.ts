import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseAsignacionSeguros } from './ResponseAsignacionSeguros';
import { Observable, of } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.component.html'
})
export class SegurosComponent implements OnInit {
  url = "https://l9ikb48a81.execute-api.us-east-1.amazonaws.com/Dev/seguros/asignacion/"+ window.localStorage.getItem('rfc').replace('"','').replace('"','');
  JsonResp: [];
  //import { Routes, Router } from 'node_modules/@angular/router';

  constructor(private formBuilder:FormBuilder,public http:HttpClient,private router: Router) { 
  }
  ngOnInit(): void {
    this.getAsignacionesbyRFC();
  }

  getAsignacionesbyRFC() {

       
        this.getAsignacionSeguro().subscribe(res => { 
          //let resp: ResponseAsignacionSeguros = res.body.response;
          this.JsonResp=JSON.parse(JSON.stringify(res.body.response['lista']));
          console.log(res.headers.get('Content-Type'));	
          

        
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

  
  getAsignacionSeguro(): Observable<HttpResponse<ResponseAsignacionSeguros>> {
    let httpHeaders = new HttpHeaders({    
         'Content-Type' : 'application/json'
    });    
    return this.http.get<ResponseAsignacionSeguros>(this.url,
        {
          headers: httpHeaders,
          observe: 'response'
        }
    );
} 

}
