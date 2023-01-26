import { ChangeDetectionStrategy, Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
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

  @Input() dataObject?: {
    hoverObject: Object3D | null,
    currentJoint: URDFJoint | null,
    currentJointValue: Number,
    selectedJoint: URDFJoint | null,
    showPopover: boolean;
    popoverPosition: {x: number, y: number};
  }
  
  @Output() newDataObject = new EventEmitter<{
    hoverObject: Object3D | null,
    currentJoint: URDFJoint | null,
    currentJointValue: Number,
    selectedJoint: URDFJoint | null,
    showPopover: boolean;
    popoverPosition: {x: number, y: number};
  }>();


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

  addNewDataObject(obj: { hoverObject: Object3D | null, currentJoint: URDFJoint | null, currentJointValue: Number, selectedJoint: URDFJoint | null, showPopover: boolean, popoverPosition: {x: number, y: number} }) {
    if(this.dataObject) {
      this.newDataObject.emit(obj);
    }
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
    this.selectedJoint = this.searchParentJoint(intersection.object) as URDFJoint;
    if(this.dataObject) {
      this.dataObject.selectedJoint = this.selectedJoint;
      this.addNewDataObject(this.dataObject);
    }

    
    console.log("joint : " + this.selectedJoint.name);
    //console.log(this.searchParentJoint(intersection.object), this.searchParentLink(ev.object));
  }

  onRobotRightClick(ev: NgtEvent<MouseEvent>) {
    const intersection = ev.intersections[0];
    if(!intersection) return;
    this.currentJoint = this.searchParentJoint(intersection.object) as URDFJoint;
    this.currentJointValue = this.currentJoint.jointValue[0];
    this.showPopover = true;
    this.popoverPosition = {x: ev.nativeEvent.clientX + 20, y: ev.nativeEvent.clientY + 20};
    
    if(this.dataObject) {
      this.dataObject.currentJoint = this.currentJoint;
      this.dataObject.currentJointValue = this.currentJointValue;
      this.dataObject.showPopover = this.showPopover;
      this.dataObject.popoverPosition = this.popoverPosition;
      this.addNewDataObject(this.dataObject);
    }
    
  }

  onWheel(ev: NgtEvent<WheelEvent>) {
    const intersection = ev.intersections[0];
    if(!intersection) return;
    this.currentJoint = this.searchParentJoint(intersection.object) as URDFJoint;
    this.currentJointValue = this.currentJoint.jointValue[0];
    this.currentJoint.setJointValue(this.currentJointValue.valueOf() + 0.001 * ev.nativeEvent.deltaY);

    if(this.dataObject) {
      this.dataObject.currentJoint = this.currentJoint;
      this.dataObject.currentJointValue = this.currentJointValue;
      this.addNewDataObject(this.dataObject);
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if(changes['dataObject']) {
      if(this.dataObject) {
        this.dataObject = changes['dataObject'].currentValue;
        console.log("dataObject: " , this.dataObject);
      }
    }
  }



  pointerOver(ev: NgtEvent<PointerEvent>) {
    const intersection = ev.intersections[0];
    
    if(!intersection){
      return;
    };
    
    
    console.log("hoverobject: " , this.hoverObject);

    this.hoverObject = ev.object;

    this.dataObject = {
      hoverObject: this.hoverObject,
      currentJoint: this.currentJoint,
      currentJointValue: this.currentJointValue,
      selectedJoint: this.selectedJoint,
      showPopover: false,
      popoverPosition: {x: 0, y: 0}
    }

    this.addNewDataObject(this.dataObject);
    this.hoverList.push(this.hoverObject);
    //console.log("hoverobject: " , this.hoverObject);
    //console.log("new colored object: " , ev.object);
    if ( (this.hoverObject instanceof Mesh) ) {
      //console.log("setting new color");
      try {
        this.colorSave = (<any> this.hoverObject).material.color.clone();
        (<any> this.hoverObject).material.color.r += 0.1;
        (<any> this.hoverObject).material.color.g += 0.1;
        (<any> this.hoverObject).material.color.b += 0.1;
        console.log("color: ", (<any> this.hoverObject).material.color);
      } catch (error) {
        console.log("error: " , error);
      }

      
    }
    
    //console.log("color: " , JSON.parse(JSON.stringify(this.hoverObject)));
    
  }

  
  pointerOut(ev: NgtEvent<PointerEvent>) {
    console.log("out", ev.object);
    (<any> ev.object).material.color = this.colorSave;

    if(this.dataObject) {
      this.dataObject.hoverObject = null;
      this.addNewDataObject(this.dataObject);
    }
    
    

  }

  constructor() {
    const manager = new LoadingManager();
    const loader = new URDFLoader( manager );

    loader.packages = '/assets/urdf/kuka_kr6_support';
    loader.load(
      '/assets/urdf/kuka_kr6_support/urdf/kr6r700sixx.urdf',
      robot => {
        this.robot = robot;
        console.log(robot);
      }
    );
  }
}