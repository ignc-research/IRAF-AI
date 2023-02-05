import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewItemComponent } from './tree-view-item.component';

describe('TreeViewItemComponent', () => {
  let component: TreeViewItemComponent;
  let fixture: ComponentFixture<TreeViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeViewItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
