import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrdfPreviewCanvasComponent } from './urdf-preview-canvas.component';

describe('UrdfPreviewCanvasComponent', () => {
  let component: UrdfPreviewCanvasComponent;
  let fixture: ComponentFixture<UrdfPreviewCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrdfPreviewCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrdfPreviewCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
