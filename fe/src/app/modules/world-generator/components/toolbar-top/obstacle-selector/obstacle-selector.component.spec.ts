import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleSelectorComponent } from './obstacle-selector.component';

describe('ObstacleSelectorComponent', () => {
  let component: ObstacleSelectorComponent;
  let fixture: ComponentFixture<ObstacleSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObstacleSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObstacleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
