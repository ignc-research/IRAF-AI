import { NgtEvent } from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { ThreeUtils } from 'src/app/helpers/three-utils';
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

    if(intersection && ThreeUtils.isChildOf(intersection.object, this.obstacle)) {
      this.uiService.selectedObject = this.obstacle;
    }
  }
}
