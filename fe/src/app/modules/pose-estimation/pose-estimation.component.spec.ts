import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseEstimationComponent } from './pose-estimation.component';

describe('PoseEstimationComponent', () => {
  let component: PoseEstimationComponent;
  let fixture: ComponentFixture<PoseEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoseEstimationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoseEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
