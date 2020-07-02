import { Component, OnInit } from '@angular/core';
import { Routes, Router } from 'node_modules/@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(location: Location,public router: Router ) { }
  ngOnInit(): void {
    let email = localStorage.getItem("email");
    if(!email){ 
      this.router.navigate(['./login']);
    }
  }

}
