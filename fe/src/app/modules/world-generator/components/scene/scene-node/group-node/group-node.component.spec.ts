import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupNodeComponent } from './group-node.component';

describe('GroupNodeComponent', () => {
  let component: GroupNodeComponent;
  let fixture: ComponentFixture<GroupNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
