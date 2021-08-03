import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlaunnaProductsContComponent } from './alaunna-products-cont.component';

describe('AlaunnaProductsContComponent', () => {
  let component: AlaunnaProductsContComponent;
  let fixture: ComponentFixture<AlaunnaProductsContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlaunnaProductsContComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlaunnaProductsContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
