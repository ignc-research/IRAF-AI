import { HostListener, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { URDFLink } from 'libs/urdf-loader/URDFLoader';
import { ThreeUtils } from 'src/app/helpers/three-utils';
import { Robot } from 'src/app/models/robot';
import { SceneObject } from 'src/app/models/scene-object';

import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class UiControlService implements OnDestroy {
  private destroyKeyListener: () => void;

  selectedObject: SceneObject | null = null;

  robotPopover: RobotPopover | null = null;

  enableZoom = true;

  transformControlMode: TransformControlType = 'translate';

  constructor(rendererFactory: RendererFactory2, private sceneService: SceneService) { 
    const renderer = rendererFactory.createRenderer(null, null);
    this.destroyKeyListener = renderer.listen('document', 'keydown', this.handleKeyboardEvent);
  }

  findThreeObj = (obj: THREE.Object3D, sceneObjs: SceneObject[]) => sceneObjs.find(x => ThreeUtils.isChildOf(obj, x.ref.value));

  onClick = (object: THREE.Object3D) => {
    const obj = this.findThreeObj(object, this.sceneService.obstacles) ??
      this.findThreeObj(object, this.sceneService.robots) ??
      this.sceneService.robots.map(x => this.findThreeObj(object, x.sensors)).find(x => !!x);
      if (obj) {
        this.selectedObject = obj;
        return;
      }
      console.log("Did not find scene object", object);
  }

  onMiss = () => {
    this.selectedObject = null;
    this.robotPopover = null;
  }

  ngOnDestroy(): void {
    this.destroyKeyListener();
  }

  handleKeyboardEvent = (event: KeyboardEvent) => {
    switch(event.key.toLowerCase()) {
      case 'r':
        this.transformControlMode = 'rotate';
        break;
      case 't':
        this.transformControlMode = 'translate';
        break;
      case 's':
        this.transformControlMode = 'scale';
        break;
      case 'delete':
        if (this.selectedObject) {
          this.sceneService.deleteSceneObject(this.selectedObject);
          this.selectedObject = null;
        }
        break;
    }
  }
}
export type TransformControlType = 'translate' | 'scale' | 'rotate';

export type RobotPopover = {
  robot: Robot;
  selectedLink: URDFLink;
  x: number;
  y: number;
}