import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOffers2Page } from './my-offers2.page';

describe('MyOffers2Page', () => {
  let component: MyOffers2Page;
  let fixture: ComponentFixture<MyOffers2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOffers2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOffers2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
