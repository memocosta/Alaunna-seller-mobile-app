import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomer2Page } from './new-customer2.page';

describe('NewCustomer2Page', () => {
  let component: NewCustomer2Page;
  let fixture: ComponentFixture<NewCustomer2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewCustomer2Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCustomer2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
