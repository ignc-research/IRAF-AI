import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotInspectorComponent } from './robot-inspector.component';

describe('RobotInspectorComponent', () => {
  let component: RobotInspectorComponent;
  let fixture: ComponentFixture<RobotInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotInspectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
