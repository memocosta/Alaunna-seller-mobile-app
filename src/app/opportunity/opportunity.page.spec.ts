import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityPage } from './opportunity.page';

describe('OpportunityPage', () => {
  let component: OpportunityPage;
  let fixture: ComponentFixture<OpportunityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
