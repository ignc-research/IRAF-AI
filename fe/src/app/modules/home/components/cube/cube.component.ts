import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtRenderState, NgtVector3 } from '@angular-three/core';
import { Mesh } from 'three';

@Component({
  selector: 'app-cube',
  standalone: true,
  templateUrl: 'cube.component.html',
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshStandardMaterial],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
  @Input() position?: NgtVector3;

  hovered = false;
  active = false;

  onCubeBeforeRender($event: { state: NgtRenderState; object: Mesh }) {
    const cube = $event.object;
    cube.rotation.x += 0.01;
  }
}