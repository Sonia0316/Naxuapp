import { Component, OnInit } from '@angular/core';
import { Routes, Router } from 'node_modules/@angular/router';
import { Location } from "@angular/common";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(location: Location,public router: Router ) { }

  ngOnInit(): void {
   
    let email = window.localStorage.getItem("email");
    let FlagRegistro = window.localStorage.getItem("FlagRegistro");

     /*if(!email){ 
          
          this.router.navigate(['./login'])
          .then(() => {
            window.location.reload();
          });
        }*/
  
    
  }
  
  DestroySession() {
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("rfc");
    window.localStorage.removeItem("FlagRegistro");
    this.router.navigate(['./login'])
    .then(() => {
      window.location.reload();
    });

    
  
  }

  adquirirseguro() {
   
    this.router.navigate(['./adquirirseguro'])
    .then(() => {
      window.location.reload();
    });
  
  }
  seguros() {
   
    this.router.navigate(['./seguros'])
    .then(() => {
      window.location.reload();
    });
  
  }
  vacaciones() {
   
    this.router.navigate(['./vacaciones'])
    .then(() => {
      window.location.reload();
    });
  
  }
  beneficios() {
   
    this.router.navigate(['./beneficios'])
    .then(() => {
      window.location.reload();
    });
  
  }
  asistencia() {
   
    this.router.navigate(['./asistencia'])
    .then(() => {
      window.location.reload();
    });
  
  }
  contacto() {
   
    this.router.navigate(['./contacto'])
    .then(() => {
      window.location.reload();
    });
  
  }
  home() {
   
    this.router.navigate(['./home'])
    .then(() => {
      window.location.reload();
    });
  
  }

  prestamos() {
   
    this.router.navigate(['./prestamos'])
    .then(() => {
      window.location.reload();
    });
  
  }
  anticipos() {
   
    this.router.navigate(['./anticipos'])
    .then(() => {
      window.location.reload();
    });
  
  }
  nomina() {
   
    this.router.navigate(['./nomina'])
    .then(() => {
      window.location.reload();
    });
  
  }
  productos() {
   
    this.router.navigate(['./productos'])
    .then(() => {
      window.location.reload();
    });
  
  }
  mispedidos() {
   
    this.router.navigate(['./mispedidos'])
    .then(() => {
      window.location.reload();
    });
  
  }
  

}
