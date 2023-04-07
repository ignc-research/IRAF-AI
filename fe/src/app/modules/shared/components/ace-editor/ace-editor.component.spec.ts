import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceEditorComponent } from './ace-editor.component';

describe('AceEditorComponent', () => {
  let component: AceEditorComponent;
  let fixture: ComponentFixture<AceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
