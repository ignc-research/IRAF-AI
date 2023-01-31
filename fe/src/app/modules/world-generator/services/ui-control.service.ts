import { HostListener, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';

import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class UiControlService implements OnDestroy {
  private destroyKeyListener: () => void;

  enableZoom = true;

  transformControlMode: TransformControlType = 'translate';

  constructor(rendererFactory: RendererFactory2, private sceneService: SceneService) { 
    const renderer = rendererFactory.createRenderer(null, null);
    this.destroyKeyListener = renderer.listen('document', 'keydown', this.handleKeyboardEvent);
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
        if (this.sceneService.selectedObject) {
          this.sceneService.deleteSceneObject(this.sceneService.selectedObject);
        }
        break;
    }
  }
}
export type TransformControlType = 'translate' | 'scale' | 'rotate';