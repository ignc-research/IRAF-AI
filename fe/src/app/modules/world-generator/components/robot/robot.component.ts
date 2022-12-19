import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtPrimitive } from '@angular-three/core/primitive';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtEvent, NgtRenderState, NgtVector3 } from '@angular-three/core';
import { LoaderUtils, Mesh, Object3D } from 'three';
import URDFLoader, { URDFRobot } from 'urdf-loader';
import { LoadingManager } from 'three';

@Component({
  selector: 'app-robot',
  standalone: true,
  templateUrl: 'robot.component.html',
  imports: [NgtMesh, NgtPrimitive, NgtBoxGeometry, NgtMeshStandardMaterial]
})


export class RobotComponent {
  robot!: URDFRobot;

  @Input() position?: NgtVector3;

  hovered = false;
  active = false;

  findObjOfType(obj: Object3D, type: string) {
    let searchObj: Object3D | null = obj;
    while(searchObj && (searchObj.constructor.name != type)) {
      searchObj = searchObj.parent;
    }
    return searchObj;
  }

  searchParentLink = (obj: Object3D) => this.findObjOfType(obj, "URDFLink");

  searchParentJoint = (obj: Object3D) => this.findObjOfType(obj, "URDFJoint");

  onRobotClick(ev: NgtEvent<MouseEvent>) {
    const intersection = ev.intersections[0];
    console.log(this.searchParentJoint(intersection.object), this.searchParentLink(ev.object));
  }

  constructor() {
    const manager = new LoadingManager();
    const loader = new URDFLoader( manager );

    loader.packages = '/assets/urdf/kuka_kr210_support';
    loader.load(
      '/assets/urdf/kuka_kr210_support/urdf/kr210l150.urdf',
      robot => {
        this.robot = robot;
        console.log(robot);
      }
    );
  }
}