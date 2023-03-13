import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SceneObject } from 'src/app/models/scene-object';
import { Trajectory } from 'src/app/models/trajectory';
import * as THREE from 'three';

@Component({
  selector: 'app-trajectory',
  templateUrl: './trajectory.component.html',
  styleUrls: ['./trajectory.component.scss']
})
export class TrajectoryComponent {
  private material = new THREE.LineBasicMaterial({color: 0x0000ff, linewidth: 1})
  private bufferGeom = new THREE.BufferGeometry();
  private _line = new THREE.Line(this.bufferGeom, this.material);

  @Input()
  trajectory!: Trajectory;

  get line(): THREE.Line {
    this.bufferGeom.setFromPoints(this.trajectory.children.map(x => (x as SceneObject).position));
    
    return this._line;
  }

  constructor() {

  }
}
