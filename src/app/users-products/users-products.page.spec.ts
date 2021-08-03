import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProductsPage } from './users-products.page';

describe('UsersProductsPage', () => {
  let component: UsersProductsPage;
  let fixture: ComponentFixture<UsersProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersProductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
