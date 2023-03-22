import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vec3InputComponent } from './vec3-input.component';

describe('Vec3InputComponent', () => {
  let component: Vec3InputComponent;
  let fixture: ComponentFixture<Vec3InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Vec3InputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vec3InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
