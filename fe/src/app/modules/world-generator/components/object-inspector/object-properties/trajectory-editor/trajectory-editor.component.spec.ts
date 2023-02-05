import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoryEditorComponent } from './trajectory-editor.component';

describe('TrajectoryEditorComponent', () => {
  let component: TrajectoryEditorComponent;
  let fixture: ComponentFixture<TrajectoryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrajectoryEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrajectoryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
