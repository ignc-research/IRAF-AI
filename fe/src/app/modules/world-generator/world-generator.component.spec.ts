import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldGeneratorComponent } from './world-generator.component';

describe('WorldGeneratorComponent', () => {
  let component: WorldGeneratorComponent;
  let fixture: ComponentFixture<WorldGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorldGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
