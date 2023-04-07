import { HostListener, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { URDFLink } from 'libs/urdf-loader/URDFLoader';
import { ThreeUtils } from 'src/app/helpers/three-utils';
import { GroupNode } from 'src/app/models/group';
import { Robot } from 'src/app/models/robot';
import { SceneNode } from 'src/app/models/scene-node';
import { SceneObject } from 'src/app/models/scene-object';

import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class UiControlService implements OnDestroy {
  private destroyKeyListener: () => void;
  private _selectedNode: SceneNode | null = null;

  private set selectedNode(node: SceneNode | null) {
    this._selectedNode = node;
  }

  get selectedNode() {
    return this._selectedNode;
  }

  get selectedObject() {
    if (this.selectedNode instanceof SceneObject) {
      return this.selectedNode as SceneObject;
    }
    return null;
  }

  robotPopover: RobotPopover | null = null;

  enableZoom = true;

  transformControlMode: TransformControlType = 'translate';

  constructor(rendererFactory: RendererFactory2, private sceneService: SceneService) { 
    const renderer = rendererFactory.createRenderer(null, null);
    this.destroyKeyListener = renderer.listen('document', 'keydown', this.handleKeyboardEvent);
  }

  selectNode(node: SceneNode | null) {
    this._selectedNode = node;
  }

  findThreeObj = (obj: THREE.Object3D, node: SceneNode): SceneNode | null => {
    console.log(node.name, node.ref.value?.uuid, obj?.uuid)
    if (node.ref.value == obj) {
      return node;
    }

    const findObj = node.children.find(x => ThreeUtils.isChildOf(obj, x.ref.value));
    if (findObj && findObj.ref.value != obj && findObj.children.length > 0) {
      const childObj = this.findThreeObj(obj, findObj);
      return childObj ?? findObj;
    }

    return findObj ?? null;
  }

  onClick = (object: THREE.Object3D) => {
    this.selectedNode = this.findThreeObj(object, this.sceneService.rootNode!);
  }

  onMiss = () => {
    this.selectedNode = this.sceneService.rootNode!;
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
        if (this.selectedNode) {
          this.sceneService.deleteSceneNode(this.selectedNode);
          this.selectedNode = null;
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