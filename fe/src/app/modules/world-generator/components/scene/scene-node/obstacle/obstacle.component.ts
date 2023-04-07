import { NgtEvent } from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { ThreeUtils } from 'src/app/helpers/three-utils';
import { URDFRobot } from 'libs/urdf-loader/URDFLoader';
import { SceneService } from '../../../../services/scene.service';
import { UiControlService } from '../../../../services/ui-control.service';
import { Obstacle } from 'src/app/models/obstacle';
import { AdvancedUrdfLoader } from 'src/app/helpers/advanced-urdf-loader';

@Component({
  selector: 'app-obstacle',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.scss']
})
export class ObstacleComponent {
  private _obstacle!: Obstacle;

  obstacleObj: URDFRobot | null = null;

  @Input()
  set obstacle(value: Obstacle) {
    if (value && value != this._obstacle) {
      new AdvancedUrdfLoader().loadUrdf(value.urdfUrl).then(x => {
        this.obstacleObj = x;
        this.uiService.selectNode(this.obstacle);
      });
    }
    this._obstacle = value;
  }

  get obstacle() {
    return this._obstacle;
  }

  constructor(private uiService: UiControlService) {
    
  }
}
