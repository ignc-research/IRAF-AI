import { Component, Input, NgZone } from '@angular/core';
import { Parameters } from 'src/app/models/parameters';
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
  object!: SceneObject;

  constructor(private sceneService: SceneService, private uiService: UiControlService, private zone: NgZone) {

  }

  updateObject() {
    if (this.uiService.selectedObject == this.object) {
      this.uiService.selectedObject = null;
    }
    this.sceneService.updateSceneObject(this.object);
  }
}
