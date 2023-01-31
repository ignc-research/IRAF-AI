import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformInputComponent } from './transform-input.component';

describe('TransformControlComponent', () => {
  let component: TransformInputComponent;
  let fixture: ComponentFixture<TransformInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
