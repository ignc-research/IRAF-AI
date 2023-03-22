import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss']
})
export class ExpandableComponent {
  @Input()
  title?: string;

  @Input()
  expanded: boolean = true;
}
