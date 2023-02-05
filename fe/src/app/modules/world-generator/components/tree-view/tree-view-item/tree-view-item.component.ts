import { Component, Input } from '@angular/core';
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
    return "question_mark";
  }

  constructor(public uiService: UiControlService) {}
}
