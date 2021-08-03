import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOfferPage } from './single-offer.page';

describe('SingleOfferPage', () => {
  let component: SingleOfferPage;
  let fixture: ComponentFixture<SingleOfferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleOfferPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
