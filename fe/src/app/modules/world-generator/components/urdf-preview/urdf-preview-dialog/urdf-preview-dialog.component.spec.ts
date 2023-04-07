import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrdfPreviewDialogComponent } from './urdf-preview-dialog.component';

describe('UrdfPreviewDialogComponent', () => {
  let component: UrdfPreviewDialogComponent;
  let fixture: ComponentFixture<UrdfPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrdfPreviewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrdfPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
