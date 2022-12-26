import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtPrimitive } from '@angular-three/core/primitive';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtEvent, NgtRenderState, NgtVector3 } from '@angular-three/core';
import { Color, LoaderUtils, Mesh, MeshLambertMaterial, Object3D } from 'three';
import URDFLoader, { URDFJoint, URDFRobot } from 'urdf-loader';
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
  currentJoint: URDFJoint | null = null;
  hoverObject: Object3D | null = null;
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

  searchParentLink = (obj: Object3D) => this.findObjOfType(obj, "URDFLink");

  searchParentJoint = (obj: Object3D) => this.findObjOfType(obj, "URDFJoint");

  onRobotClick(ev: NgtEvent<MouseEvent>) {
    const intersection = ev.intersections[0];
    if(!intersection) return;
    this.currentJoint = this.searchParentJoint(intersection.object) as URDFJoint;
    this.currentJointValue = this.currentJoint.jointValue[0];
    this.currentJoint.setJointValue(this.currentJointValue.valueOf() + 0.1);
    if(this.currentJoint) {
      this.currentJointValue = this.currentJoint.jointValue[0];
      this.currentJoint.setJointValue(this.currentJointValue.valueOf() + ev.delta * 0.01);
    }
    console.log("joint : " + this.currentJoint.name);
    //console.log(this.searchParentJoint(intersection.object), this.searchParentLink(ev.object));
  }

  onRobotMove(ev: NgtEvent<MouseEvent>) {
    const intersection = ev.intersections[0];
    if(!intersection) return;
    this.currentJoint = this.searchParentJoint(intersection.object) as URDFJoint;
    if(this.currentJoint) {
      this.currentJointValue = this.currentJoint.jointValue[0];
      this.currentJoint.setJointValue(this.currentJointValue.valueOf() + ev.delta * 0.01);
    }
  }




  pointerOver(ev: NgtEvent<PointerEvent>) {
    const intersection = ev.intersections[0];
    
    if(!intersection){
      return;
    };
    
    
    console.log("hoverobject: " , this.hoverObject);

    this.hoverObject = ev.object;
    this.hoverList.push(this.hoverObject);
    console.log("hoverobject: " , this.hoverObject);
    console.log("new colored object: " , ev.object);
    if ( (this.hoverObject instanceof Mesh) ) {
      console.log("setting new color");
      try {
        this.colorSave = (<any> this.hoverObject).material.color.clone();
        (<any> this.hoverObject).material.color.b = 0.99;
      } catch (error) {
        console.log("error: " , error);
      }

      
    }
    
    //console.log("color: " , JSON.parse(JSON.stringify(this.hoverObject)));
    
  }

  
  pointerOut(ev: NgtEvent<PointerEvent>) {
    console.log("out", ev.object);
    (<any> ev.object).material.color = this.colorSave;
    

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