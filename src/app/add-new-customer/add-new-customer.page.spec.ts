import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCustomerPage } from './add-new-customer.page';

describe('AddNewCustomerPage', () => {
  let component: AddNewCustomerPage;
  let fixture: ComponentFixture<AddNewCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewCustomerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
