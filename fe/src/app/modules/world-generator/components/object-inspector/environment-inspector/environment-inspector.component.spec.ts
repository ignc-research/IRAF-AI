import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentInspectorComponent } from './environment-inspector.component';

describe('EnvironmentInspectorComponent', () => {
  let component: EnvironmentInspectorComponent;
  let fixture: ComponentFixture<EnvironmentInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvironmentInspectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
