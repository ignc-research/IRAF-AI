import { NgtCameraOptions, NgtCanvas, NgtEvent, NgtSceneOptions } from '@angular-three/core';
import { Component, NgZone } from '@angular/core';
import { SceneService } from './services/scene.service';
import { GeneratorApiService } from './services/generator.api.service';
import { UiControlService } from './services/ui-control.service';

@Component({
  selector: 'app-home',
  templateUrl: './world-generator.component.html',
  styleUrls: ['./world-generator.component.scss']
})

export class WorldGeneratorComponent {
  camera: NgtCameraOptions = {

  }

  scene: NgtSceneOptions = {
    up: [0, 0, 1]
  }

  constructor(public sceneService: SceneService, private zone: NgZone, public uiService: UiControlService) {
 
  }

  

    pointerMissed = (ev: any) => {
      this.zone.run(() => this.uiService.onMiss());
    }
  
}