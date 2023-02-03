import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterEditorComponent } from './parameter-editor.component';

describe('ParameterEditorComponent', () => {
  let component: ParameterEditorComponent;
  let fixture: ComponentFixture<ParameterEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
