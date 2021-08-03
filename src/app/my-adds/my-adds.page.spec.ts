import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAddsPage } from './my-adds.page';

describe('MyAddsPage', () => {
  let component: MyAddsPage;
  let fixture: ComponentFixture<MyAddsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAddsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAddsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
