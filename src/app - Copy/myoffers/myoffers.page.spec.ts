import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyoffersPage } from './myoffers.page';

describe('MyoffersPage', () => {
  let component: MyoffersPage;
  let fixture: ComponentFixture<MyoffersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyoffersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyoffersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
