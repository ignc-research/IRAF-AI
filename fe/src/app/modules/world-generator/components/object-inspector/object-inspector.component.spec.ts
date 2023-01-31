import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectInspectorComponent } from './object-inspector.component';

describe('ObjectInspectorComponent', () => {
  let component: ObjectInspectorComponent;
  let fixture: ComponentFixture<ObjectInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectInspectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
