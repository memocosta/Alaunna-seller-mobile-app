import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverSettingPage } from './deliver-setting.page';

describe('DeliverSettingPage', () => {
  let component: DeliverSettingPage;
  let fixture: ComponentFixture<DeliverSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverSettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
