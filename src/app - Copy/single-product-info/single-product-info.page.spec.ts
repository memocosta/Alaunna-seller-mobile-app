import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductInfoPage } from './single-product-info.page';

describe('SingleProductInfoPage', () => {
  let component: SingleProductInfoPage;
  let fixture: ComponentFixture<SingleProductInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleProductInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProductInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
