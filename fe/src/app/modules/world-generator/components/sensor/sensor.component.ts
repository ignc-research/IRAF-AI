import { NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtSobaTransformControls } from '@angular-three/soba/controls';
import { Component } from '@angular/core';
import { TransformControlsDirective } from '../../directives/transform-controls.directive';

@Component({
  selector: 'app-sensor',
  standalone: true,
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss'],
  imports: [NgtMesh, NgtSphereGeometry, NgtMeshStandardMaterial, TransformControlsDirective, NgtSobaTransformControls]
})
export class SensorComponent {
  userData = {
    type: "Sensor"
  }
}
