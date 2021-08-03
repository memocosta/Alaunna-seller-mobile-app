import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCouponsPage } from './my-coupons.page';

describe('MyCouponsPage', () => {
  let component: MyCouponsPage;
  let fixture: ComponentFixture<MyCouponsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCouponsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCouponsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
