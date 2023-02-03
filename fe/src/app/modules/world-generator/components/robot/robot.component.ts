import { ChangeDetectionStrategy, Component, Input, SimpleChanges, Output, EventEmitter, AfterViewInit, NgZone } from '@angular/core';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtPrimitive } from '@angular-three/core/primitive';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtEvent, NgtRenderState, NgtVector3 } from '@angular-three/core';
import { Color, LoaderUtils, Mesh, MeshLambertMaterial, Object3D } from 'three';
import URDFLoader, { URDFJoint, URDFLink, URDFRobot } from 'urdf-loader';
import { LoadingManager } from 'three';
import { Robot, SceneService } from '../../services/scene.service';
import { UiControlService } from '../../services/ui-control.service';
import { ThreeUtils } from 'src/app/helpers/three-utils';


@Component({
  selector: 'app-robot',
  templateUrl: 'robot.component.html'
})


export class RobotComponent {
  _robot!: Robot;

  @Input()
  set robot(value: Robot) {
    if (value) {
      this._robot = value;
    }
  }

  get robot() {
    return this._robot;
  }

  @Input() position?: NgtVector3;


  hovered = false;
  active = false;
  hoverObject: Object3D | null = null;
  currentJoint: URDFJoint | null = null;
  selectedJoint: URDFJoint | null = null;
  showPopover: boolean = false;
  popoverPosition: {x: number, y: number} = {x:100, y:100};
  //hoverObject: Object3D | null = null;
  colorSave: Color | null = null;
  hoverList: Object3D[] = [];
  currentJointValue: Number = 0;


  onRobotBeforeRender($event: { state: NgtRenderState; object: Mesh }) {
    const robot = $event.object;
    robot.castShadow = true;
  }


  findObjOfType(obj: Object3D, type: string) {
    let searchObj: Object3D | null = obj;
    while(searchObj && (searchObj.constructor.name != type)) {
      searchObj = searchObj.parent;
    }
    return searchObj;
  }

  searchParentLink = (obj: Object3D) => this.findObjOfType(obj, "URDFLink") ?? this.robot.robot;

  searchParentJoint = (obj: Object3D) => this.findObjOfType(obj, "URDFJoint");

  onRobotClick(ev: NgtEvent<MouseEvent>) {
    const intersection = ev.intersections[0]?.object;
    if (!intersection) {
      return;
    }
    if (!ThreeUtils.isChildOf(intersection, this.robot.robot)) {
      return;
    }

    if(intersection.userData['type'] == "Sensor") {
      this.uiService.selectedObject = intersection;
      return;
    }
    
    this.uiService.selectedObject = this.robot.robot;
  }

  onRobotRightClick(ev: NgtEvent<MouseEvent>) {
    const intersection = ev.intersections[0];
    if(!intersection) return;
    console.log(intersection)

    this.uiService.robotPopover = {
      robot: this.robot,
      selectedLink: this.searchParentLink(intersection.object) as URDFLink,
      x: ev.nativeEvent.clientX + 20,
      y: ev.nativeEvent.clientY + 20
    };
  }

  onWheel(ev: NgtEvent<WheelEvent>) {
    const intersection = ev.intersections[0];
    if(!intersection) return;
    this.currentJoint = this.searchParentJoint(intersection.object) as URDFJoint;
    this.currentJointValue = this.currentJoint.jointValue[0];
    this.currentJoint.setJointValue(this.currentJointValue.valueOf() + 0.001 * ev.nativeEvent.deltaY);
  }


  pointerOver(ev: NgtEvent<PointerEvent>) {
    const intersection = ev.intersections[0];
    
    if(!intersection){
      return;
    };

    this.hoverObject = ev.object;

    if ( (this.hoverObject instanceof Mesh) ) {
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
    (<any> ev.object).material.color = this.colorSave;
  }

  constructor(public sceneService: SceneService, private uiService: UiControlService) {

  }
}