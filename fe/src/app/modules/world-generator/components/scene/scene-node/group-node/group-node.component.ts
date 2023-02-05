import { Component, Input } from '@angular/core';
import { GroupNode } from 'src/app/models/group';

@Component({
  selector: 'app-group-node',
  templateUrl: './group-node.component.html',
  styleUrls: ['./group-node.component.scss']
})
export class GroupNodeComponent {
  @Input()
  group!: GroupNode;
}
