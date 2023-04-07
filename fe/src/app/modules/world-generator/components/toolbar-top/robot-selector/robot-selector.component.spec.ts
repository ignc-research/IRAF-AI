import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotSelectorComponent } from './robot-selector.component';

describe('RobotSelectorComponent', () => {
  let component: RobotSelectorComponent;
  let fixture: ComponentFixture<RobotSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
