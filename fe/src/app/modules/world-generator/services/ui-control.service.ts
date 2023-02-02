import { HostListener, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { URDFLink } from 'urdf-loader';

import { Robot, SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class UiControlService implements OnDestroy {
  private destroyKeyListener: () => void;

  selectedObject: THREE.Object3D | null = null;

  robotPopover: RobotPopover | null = null;

  enableZoom = true;

  transformControlMode: TransformControlType = 'translate';

  constructor(rendererFactory: RendererFactory2, private sceneService: SceneService) { 
    const renderer = rendererFactory.createRenderer(null, null);
    this.destroyKeyListener = renderer.listen('document', 'keydown', this.handleKeyboardEvent);
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