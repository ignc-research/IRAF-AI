import { NgtCameraOptions, NgtEvent, NgtSceneOptions, Ref } from '@angular-three/core';
import { Component, NgZone } from '@angular/core';
import { SceneNode } from 'src/app/models/scene-node';
import { SceneObject } from 'src/app/models/scene-object';
import * as THREE from 'three';
import { MeshPhongMaterial } from 'three';
import { SceneService } from '../../services/scene.service';
import { UiControlService } from '../../services/ui-control.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent {
  private colorSave: THREE.Color | null = null;
  private hoverObject!: THREE.Object3D;

  camera: NgtCameraOptions = {
    up: [0, 0, 1]
  }

  scene: NgtSceneOptions = {
    up: [0, 0, 1]
  }

  rootRef: Ref<THREE.Object3D> = new Ref<THREE.Object3D>();

  constructor(public sceneService: SceneService, private zone: NgZone, public uiService: UiControlService) {
    this.uiService.onMiss();
    this.sceneService.invalidateRefs();
  }

  objectClick(event: any) {
    console.log(event.intersections)
    this.uiService.onClick(event.intersections[0]?.object);
  }

  objectMiss(event: any) {
    this.uiService.onMiss();
  }

  pointerOver(ev: NgtEvent<PointerEvent>) {
    const intersection = ev.intersections[0];
    
    if(!intersection){
      return;
    };

    this.hoverObject = ev.object;

    if ( (this.hoverObject instanceof THREE.Mesh && this.hoverObject.material instanceof MeshPhongMaterial) ) {
      try {
        this.colorSave = (<any> this.hoverObject).material.color.clone();
        (<any> this.hoverObject).material.color.r += 0.1;
        (<any> this.hoverObject).material.color.g += 0.1;
        (<any> this.hoverObject).material.color.b += 0.1;
      } catch (error) {
      }

      
    }
  }

  pointerOut(ev: NgtEvent<PointerEvent>) {
    if ( (this.hoverObject instanceof THREE.Mesh && this.hoverObject.material instanceof MeshPhongMaterial) ) {
      try {
        (<any> ev.object).material.color.r = this.colorSave?.r ?? 0;
        (<any> ev.object).material.color.g = this.colorSave?.g ?? 0;
        (<any> ev.object).material.color.b = this.colorSave?.b ?? 0;
      } catch (error) {
      }

      
    }

  }
}
