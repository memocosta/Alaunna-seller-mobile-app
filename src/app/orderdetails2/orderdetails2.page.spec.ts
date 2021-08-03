import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderdetails2Page } from './orderdetails2.page';

describe('Orderdetails2Page', () => {
  let component: Orderdetails2Page;
  let fixture: ComponentFixture<Orderdetails2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Orderdetails2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Orderdetails2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
