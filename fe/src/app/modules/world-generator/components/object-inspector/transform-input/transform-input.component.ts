import { Component, Input } from '@angular/core';
import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-transform-input',
  templateUrl: './transform-input.component.html',
  styleUrls: ['./transform-input.component.scss']
})
export class TransformInputComponent {
  
  rad2Degree = (180.0 / Math.PI);
  degree2Rad = (Math.PI / 180.0);

  @Input()
  object!: THREE.Object3D | null;

  get rotationX() {
    return (this.object?.rotation.x ?? 0) * this.rad2Degree;
  }

  set rotationX(val: number) {
    if (this.object) {
      this.object.rotation.x = val * this.degree2Rad;
    }
  }

  get rotationY() {
    return (this.object?.rotation.y ?? 0) * this.rad2Degree;
  }

  set rotationY(val: number) {
    if (this.object) {
      this.object.rotation.y = val * this.degree2Rad;
    }
  }

  get rotationZ() {
    return (this.object?.rotation.z ?? 0) * this.rad2Degree;
  }

  set rotationZ(val: number) {
    if (this.object) {
      this.object.rotation.z = val * this.degree2Rad;
    }
  }
  
  get scale() {
    return this.object?.scale.x ?? 0;
  }

  set scale(val: number) {
    if (this.object) {
      this.object.scale.set(val, val, val);
    }
  }
  
  constructor(private sceneService: SceneService) {

  }

}
