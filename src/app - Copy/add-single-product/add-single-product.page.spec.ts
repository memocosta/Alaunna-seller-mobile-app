import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSingleProductPage } from './add-single-product.page';

describe('AddSingleProductPage', () => {
  let component: AddSingleProductPage;
  let fixture: ComponentFixture<AddSingleProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSingleProductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSingleProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
