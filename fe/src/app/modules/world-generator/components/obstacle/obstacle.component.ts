import { NgtEvent } from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { URDFRobot } from 'urdf-loader';
import { SceneService } from '../../services/scene.service';
import { UiControlService } from '../../services/ui-control.service';

@Component({
  selector: 'app-obstacle',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.scss']
})
export class ObstacleComponent {

  @Input()
  obstacle!: THREE.Object3D;

  constructor(private uiService: UiControlService) {

  }

  onClick(ev: NgtEvent<MouseEvent>) {
    const intersection = ev.intersections[0];
    if(intersection && intersection.object.userData['type'] == "Sensor") {
      this.uiService.selectedObject = intersection.object;
      return;
    }
    console.log(intersection.object);
    this.uiService.selectedObject = this.obstacle;
    // const selectedLink = this.searchParentLink(intersection.object) as URDFJoint;
    // this.robot.userData['selectedLink'] = selectedLink;
  }
}
