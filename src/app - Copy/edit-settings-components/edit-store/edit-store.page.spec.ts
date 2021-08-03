import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStorePage } from './edit-store.page';

describe('EditStorePage', () => {
  let component: EditStorePage;
  let fixture: ComponentFixture<EditStorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStorePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
