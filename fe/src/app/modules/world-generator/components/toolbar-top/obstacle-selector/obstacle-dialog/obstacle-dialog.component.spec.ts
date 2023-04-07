import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleDialogComponent } from './obstacle-dialog.component';

describe('ObstacleDialogComponent', () => {
  let component: ObstacleDialogComponent;
  let fixture: ComponentFixture<ObstacleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObstacleDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObstacleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
