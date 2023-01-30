import { NgtEvent } from '@angular-three/core';
import { NgtSobaTransformControls } from '@angular-three/soba/controls';
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { SceneService } from '../services/scene.service';

@Directive({
  selector: '[appTransformControls]',
  standalone: true
})
export class TransformControlsDirective implements OnDestroy {
  private subs: Subscription[] = [];
  private _enabled = false;


  constructor(private controls: NgtSobaTransformControls, private sceneService: SceneService) { 
    this.subs.push(controls.change.subscribe(this.onControlsChange));
    this.subs.push(controls.pointerdown.subscribe(this.onPointerDown));
    this.subs.push(this.sceneService.selectedObject.subscribe(this.onSelectedObjChange));
  }


  ngOnDestroy(): void {
    this.subs.forEach(x => x.unsubscribe());
    this.subs = [];
  }

  onPointerDown = (ev: NgtEvent<PointerEvent>) => {
    this.sceneService.selectedObject.next((this.controls.instanceValue as any)?.object.children[0]);
  };

  onSelectedObjChange = (obj: THREE.Object3D | null) => {
    if (!obj || obj != (this.controls.instanceValue as any)?.object.children[0]) {
      this.controls.enabled = false;
      this.controls.size = 0;
      return;
    }
    this.controls.enabled = true;
    this.controls.size = 1;
  }

  onControlsChange = (ev: any) => {
    if (ev.target.mode != 'scale') {
      return;
    }
    const targetObj = ev.target.object;
    if (targetObj) {
      if (targetObj.scale.x != targetObj.scale.y && targetObj.scale.x != targetObj.scale.z) {
        targetObj.scale.set(targetObj.scale.x, targetObj.scale.x, targetObj.scale.x);
      }
      if (targetObj.scale.y != targetObj.scale.x && targetObj.scale.y != targetObj.scale.z) {
        targetObj.scale.set(targetObj.scale.y, targetObj.scale.y, targetObj.scale.y);
      }
      if (targetObj.scale.z != targetObj.scale.x && targetObj.scale.z != targetObj.scale.y) {
        targetObj.scale.set(targetObj.scale.z, targetObj.scale.z, targetObj.scale.z);
      }
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    switch(event.key.toLowerCase()) {
      case 'r':
        this.controls.mode = 'rotate';
        break;
      case 't':
        this.controls.mode = 'translate';
        break;
      case 's':
        this.controls.mode = 'scale';
        break;
    }
  }

}
