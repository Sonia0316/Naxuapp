import { Component, OnInit } from '@angular/core';
import { Routes, Router } from 'node_modules/@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public router: Router ) { }

  ngOnInit(): void {
  }

}
