import { NgtCameraOptions, NgtSceneOptions } from '@angular-three/core';
import { Component, NgZone } from '@angular/core';
import { SceneNode } from 'src/app/models/scene-node';
import { SceneObject } from 'src/app/models/scene-object';
import { SceneService } from '../../services/scene.service';
import { UiControlService } from '../../services/ui-control.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent {
  camera: NgtCameraOptions = {
    up: [0, 0, 1]
  }

  scene: NgtSceneOptions = {
    up: [0, 0, 1]
  }

  constructor(public sceneService: SceneService, private zone: NgZone, public uiService: UiControlService) {
    this.uiService.onMiss();
    this.sceneService.invalidateRefs();
  }

  objectClick(event: any) {
    this.uiService.onClick(event.intersections[0]?.object);
  }

  objectMiss(event: any) {
    this.uiService.onMiss();
  }
}
