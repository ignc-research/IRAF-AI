import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformControlsComponent } from './transform-controls.component';

describe('TransformControlsComponent', () => {
  let component: TransformControlsComponent;
  let fixture: ComponentFixture<TransformControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
