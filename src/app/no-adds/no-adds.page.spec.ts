import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAddsPage } from './no-adds.page';

describe('NoAddsPage', () => {
  let component: NoAddsPage;
  let fixture: ComponentFixture<NoAddsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoAddsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAddsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
