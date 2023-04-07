import { Component, Input } from '@angular/core';
import { NgtEvent, NgtRenderState, NgtVector3 } from '@angular-three/core';
import { Color, Mesh, Object3D } from 'three';
// import URDFLoader, { URDFJoint, URDFLink, URDFRobot } from 'libs/urdf-loader/URDFLoader';
import { LoadingManager } from 'three';
import { SceneService } from '../../../../services/scene.service';
import { UiControlService } from '../../../../services/ui-control.service';
import { ThreeUtils } from 'src/app/helpers/three-utils';
import { URDFJoint, URDFLink, URDFRobot } from 'libs/urdf-loader/URDFLoader';
import { Robot } from 'src/app/models/robot';
import { SceneObjectType } from 'src/app/models/scene-object-type';
import { AdvancedUrdfLoader } from 'src/app/helpers/advanced-urdf-loader';
import { NumberUtils } from 'src/app/helpers/number-utils';

@Component({
  selector: 'app-robot',
  templateUrl: 'robot.component.html',
})
export class RobotComponent {
  robotObj: URDFRobot | null = null;
  _robot!: Robot;

  @Input()
  set robot(value: Robot) {
    if (value && value != this._robot) {
      new AdvancedUrdfLoader().loadUrdf(value.urdfUrl).then((x) => {
        this.robotObj = x;
        this.uiService.selectNode(value);
        this.loadRestingAngles(x, value);
      });
    }
    this._robot = value;
  }

  get robot() {
    return this._robot;
  }

  hovered = false;
  active = false;
  hoverObject: Object3D | null = null;
  currentJoint: URDFJoint | null = null;
  selectedJoint: URDFJoint | null = null;
  showPopover: boolean = false;
  popoverPosition: { x: number; y: number } = { x: 100, y: 100 };
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
    while (searchObj && searchObj.constructor.name != type) {
      searchObj = searchObj.parent;
    }
    return searchObj;
  }

  searchParentLink = (obj: Object3D) =>
    this.findObjOfType(obj, 'URDFLink') ?? this.robot.ref.value;

  searchParentJoint = (obj: Object3D) => this.findObjOfType(obj, 'URDFJoint');

  onRobotRightClick(ev: NgtEvent<MouseEvent>) {
    const intersection = ev.intersections[0];
    if (!intersection) return;
    console.log(intersection);

    this.uiService.robotPopover = {
      robot: this.robot,
      selectedLink: this.searchParentLink(intersection.object) as URDFLink,
      x: ev.nativeEvent.clientX + 20,
      y: ev.nativeEvent.clientY + 20,
    };
  }

  onWheel(ev: NgtEvent<WheelEvent>) {
    this.uiService.enableZoom = false;
    const intersection = ev.intersections[0];
    if (!intersection) return;
    this.currentJoint = this.searchParentJoint(
      intersection.object
    ) as URDFJoint;
    if (!this.currentJoint) return;
    this.currentJointValue = this.currentJoint.jointValue[0];
    this.currentJoint.setJointValue(
      this.currentJointValue.valueOf() + 0.001 * ev.nativeEvent.deltaY
    );

    this.updateRestingAngles();
  }

  pointerLeave() {
    this.uiService.enableZoom = true;
  }

  loadRestingAngles(robotObj: URDFRobot, robot: Robot) {
      console.log(robotObj.joints, robot.resting_angles)
    if (robot.resting_angles && robotObj) {
      Object.keys(robotObj.joints).forEach((x, i) => {
        this.robotObj?.joints[x].setJointValue(this.robot.resting_angles![i]);
      });
    }
  }

  updateRestingAngles() {
    if (this.robotObj) {
      this.robot.resting_angles = Object.keys(this.robotObj.joints ?? {}).map(
        (x) => this.robotObj?.joints[x].jointValue[0].valueOf() ?? 0
      );
    }
  }

  constructor(
    public sceneService: SceneService,
    private uiService: UiControlService
  ) {}
}
