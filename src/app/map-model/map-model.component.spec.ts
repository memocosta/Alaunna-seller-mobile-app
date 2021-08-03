import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapModelComponent } from './map-model.component';

describe('MapModelComponent', () => {
  let component: MapModelComponent;
  let fixture: ComponentFixture<MapModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapModelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
