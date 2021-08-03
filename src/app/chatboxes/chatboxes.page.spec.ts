import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboxesPage } from './chatboxes.page';

describe('ChatboxesPage', () => {
  let component: ChatboxesPage;
  let fixture: ComponentFixture<ChatboxesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatboxesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatboxesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
