import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoryComponent } from './trajectory.component';

describe('TrajectoryComponent', () => {
  let component: TrajectoryComponent;
  let fixture: ComponentFixture<TrajectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrajectoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrajectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
