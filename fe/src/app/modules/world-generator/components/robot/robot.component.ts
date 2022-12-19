import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtRenderState, NgtVector3 } from '@angular-three/core';
import { Mesh } from 'three';
import URDFLoader from 'urdf-loader';
import { LoadingManager } from 'three';

@Component({
  selector: 'app-robot',
  standalone: true,
  templateUrl: 'robot.component.html',
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshStandardMaterial],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class RobotComponent {
  @Input() position?: NgtVector3;

  hovered = false;
  active = false;

  onRobotBeforeRender($event: { state: NgtRenderState; object: Mesh }) {
    const robot = $event.object;
    robot.rotation.x += 0.01;
  }

  onRobotClick($event: MouseEvent) {
    this.active = !this.active;
  }


}