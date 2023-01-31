import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformModeSelectorComponent } from './transform-mode-selector.component';

describe('TransformModeSelectorComponent', () => {
  let component: TransformModeSelectorComponent;
  let fixture: ComponentFixture<TransformModeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformModeSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
