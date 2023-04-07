import { Component, Input, NgZone } from '@angular/core';
import { Parameters } from 'src/app/models/parameters';
import { SceneNode } from 'src/app/models/scene-node';
import { SceneObject } from 'src/app/models/scene-object';
import { SceneService } from '../../../services/scene.service';
import { UiControlService } from '../../../services/ui-control.service';

@Component({
  selector: 'app-object-properties',
  templateUrl: './object-properties.component.html',
  styleUrls: ['./object-properties.component.scss']
})
export class ObjectPropertiesComponent {
  @Input()
  node!: SceneNode;

  constructor(private sceneService: SceneService, private uiService: UiControlService, private zone: NgZone) {

  }

  updateNode() {
    if (this.uiService.selectedObject == this.node) {
      this.uiService.selectNode(null);
    }
    this.sceneService.updateSceneNode(this.node);
  }
}
