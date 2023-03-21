import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarPlotComponent } from './radar-plot.component';

describe('RadarPlotComponent', () => {
  let component: RadarPlotComponent;
  let fixture: ComponentFixture<RadarPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadarPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadarPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
