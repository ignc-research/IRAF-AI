import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotPopoverComponent } from './robot-popover.component';

describe('RobotPopoverComponent', () => {
  let component: RobotPopoverComponent;
  let fixture: ComponentFixture<RobotPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotPopoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
