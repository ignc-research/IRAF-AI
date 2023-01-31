import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrdfPreviewComponent } from './urdf-preview.component';

describe('UrdfPreviewComponent', () => {
  let component: UrdfPreviewComponent;
  let fixture: ComponentFixture<UrdfPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrdfPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrdfPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
