import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdquirirSeguroComponent } from './adquirir-seguro.component';

describe('AdquirirSeguroComponent', () => {
  let component: AdquirirSeguroComponent;
  let fixture: ComponentFixture<AdquirirSeguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdquirirSeguroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdquirirSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
