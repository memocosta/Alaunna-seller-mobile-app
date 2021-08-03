import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferReplyPage } from './offer-reply.page';

describe('OfferReplyPage', () => {
  let component: OfferReplyPage;
  let fixture: ComponentFixture<OfferReplyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferReplyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferReplyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
