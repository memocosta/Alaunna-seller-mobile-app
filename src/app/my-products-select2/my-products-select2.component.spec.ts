import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProductsSelect2Component } from './my-products-select2.component';

describe('MyProductsSelect2Component', () => {
  let component: MyProductsSelect2Component;
  let fixture: ComponentFixture<MyProductsSelect2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProductsSelect2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProductsSelect2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
