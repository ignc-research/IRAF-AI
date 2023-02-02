import { Component } from '@angular/core';
import { SceneService } from '../../../services/scene.service';
import { UiControlService } from '../../../services/ui-control.service';

@Component({
  selector: 'app-robot-popover',
  templateUrl: './robot-popover.component.html',
  styleUrls: ['./robot-popover.component.scss']
})
export class RobotPopoverComponent {
  constructor(public uiService: UiControlService, public sceneService: SceneService) {

  }

  addSensor() {
    if (this.uiService.robotPopover) {
      this.sceneService.addSensor(this.uiService.robotPopover.robot, this.uiService.robotPopover.selectedLink);
      this.uiService.robotPopover = null;
    }
  }

}
