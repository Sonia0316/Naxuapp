import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterloginComponent } from './footerlogin.component';

describe('FooterloginComponent', () => {
  let component: FooterloginComponent;
  let fixture: ComponentFixture<FooterloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
