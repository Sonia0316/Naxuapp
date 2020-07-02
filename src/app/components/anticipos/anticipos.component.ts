import { Component, OnInit } from '@angular/core';
import { Routes, Router } from 'node_modules/@angular/router';

@Component({
  selector: 'app-anticipos',
  templateUrl: './anticipos.component.html'
  })
export class AnticiposComponent implements OnInit {

  //import { Routes, Router } from 'node_modules/@angular/router';
  constructor(public router: Router ) { }
  ngOnInit(): void {
    
  }

}
