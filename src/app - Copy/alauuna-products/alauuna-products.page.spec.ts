import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlauunaProductsPage } from './alauuna-products.page';

describe('AlauunaProductsPage', () => {
  let component: AlauunaProductsPage;
  let fixture: ComponentFixture<AlauunaProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlauunaProductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlauunaProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
