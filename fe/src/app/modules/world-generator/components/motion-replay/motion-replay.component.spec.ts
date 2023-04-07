import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotionReplayComponent } from './motion-replay.component';

describe('MotionReplayComponent', () => {
  let component: MotionReplayComponent;
  let fixture: ComponentFixture<MotionReplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotionReplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotionReplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
