import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersClientsPage } from './users-clients.page';

describe('UsersProductsPage', () => {
  let component: UsersClientsPage;
  let fixture: ComponentFixture<UsersClientsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersClientsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersClientsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
