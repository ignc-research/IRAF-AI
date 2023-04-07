import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerTasksComponent } from './server-tasks.component';

describe('ServerTasksComponent', () => {
  let component: ServerTasksComponent;
  let fixture: ComponentFixture<ServerTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
