import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoryPlotComponent } from './trajectory-plot.component';

describe('TrajectoryPlotComponent', () => {
  let component: TrajectoryPlotComponent;
  let fixture: ComponentFixture<TrajectoryPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrajectoryPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrajectoryPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
