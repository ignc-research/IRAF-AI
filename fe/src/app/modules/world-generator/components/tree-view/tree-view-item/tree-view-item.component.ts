import { Component, Input } from '@angular/core';
import { GroupNode } from 'src/app/models/group';
import { Marker } from 'src/app/models/marker';
import { Obstacle } from 'src/app/models/obstacle';
import { Robot, Sensor } from 'src/app/models/robot';
import { SceneNode } from 'src/app/models/scene-node';
import { SceneService } from '../../../services/scene.service';
import { UiControlService } from '../../../services/ui-control.service';

@Component({
  selector: 'app-tree-view-item',
  templateUrl: './tree-view-item.component.html',
  styleUrls: ['./tree-view-item.component.scss']
})
export class TreeViewItemComponent {
  @Input()
  sceneNode!: SceneNode;

  get icon() {
    if (this.sceneNode instanceof Robot) {
      return "precision_manufacturing";
    }
    if (this.sceneNode instanceof Sensor) {
      return "sensors";
    }
    if (this.sceneNode instanceof Obstacle) {
      return "view_in_ar";
    }
    if (this.sceneNode instanceof GroupNode) {
      return "widgets";
    }
    if (this.sceneNode instanceof Marker) {
      return "pin_drop";
    }
    return "question_mark";
  }

  constructor(public uiService: UiControlService) {}
}
