import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShippingPage } from './add-shipping.page';

describe('AddShippingPage', () => {
  let component: AddShippingPage;
  let fixture: ComponentFixture<AddShippingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShippingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShippingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
