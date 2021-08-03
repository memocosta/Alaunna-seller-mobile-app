import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdsPage } from './add-ads.page';

describe('AddAdsPage', () => {
  let component: AddAdsPage;
  let fixture: ComponentFixture<AddAdsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
