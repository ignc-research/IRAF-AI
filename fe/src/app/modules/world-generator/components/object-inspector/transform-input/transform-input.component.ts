import { Component, Input } from '@angular/core';
import { SceneObject } from 'src/app/models/scene-object';
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
  object!: SceneObject | null;

  get positionX() {
    return this.object?.position.x ?? 0;
  }

  set positionX(value: number) {
    if (this.object) {
      this.object.position.x = value;
      if (this.object.ref.value) {
        this.object.ref.value.position.x = value;
      }
    }
  }

  get positionY() {
    return this.object?.position.x ?? 0;
  }

  set positionY(value: number) {
    if (this.object) {
      this.object.position.y = value;
      if (this.object.ref.value) {
        this.object.ref.value.position.y = value;
      }
    }
  }

  get positionZ() {
    return this.object?.position.z ?? 0;
  }

  set positionZ(value: number) {
    if (this.object) {
      this.object.position.z = value;
      if (this.object.ref.value) {
        this.object.ref.value.position.z = value;
      }
    }
  }

  get rotationX() {
    return (this.object?.rotation.x ?? 0) * this.rad2Degree;
  }

  set rotationX(value: number) {
    if (this.object) {
      this.object.rotation.x = value * this.degree2Rad;
      if (this.object.ref.value) {
        this.object.ref.value.rotation.x = value * this.degree2Rad;
      }
    }
  }

  get rotationY() {
    return (this.object?.rotation.y ?? 0) * this.rad2Degree;
  }

  set rotationY(value: number) {
    if (this.object) {
      this.object.rotation.y = value * this.degree2Rad;
      if (this.object.ref.value) {
        this.object.ref.value.rotation.y = value * this.degree2Rad;
      }
    }
  }

  get rotationZ() {
    return (this.object?.rotation.z ?? 0) * this.rad2Degree;
  }

  set rotationZ(value: number) {
    if (this.object) {
      this.object.rotation.z = value * this.degree2Rad;
      if (this.object.ref.value) {
        this.object.ref.value.rotation.z = value * this.degree2Rad;
      }
    }
  }

  get scale() {
    return this.object?.scale.x ?? 0;
  }

  set scale(val: number) {
    if (this.object) {
      this.object.scale.set(val, val, val);
      if (this.object.ref.value) {
        this.object.ref.value.scale.set(val, val, val);
      }
    }
  }
  
  constructor(private sceneService: SceneService) {

  }

}
