import { Component } from '@angular/core';
import { ISensor } from 'src/app/models/robot';
import { GeneratorApiService } from 'src/app/modules/world-generator/services/generator.api.service';
import { SceneService } from '../../../../../services/scene.service';
import { UiControlService } from '../../../../../services/ui-control.service';

@Component({
  selector: 'app-robot-popover',
  templateUrl: './robot-popover.component.html',
  styleUrls: ['./robot-popover.component.scss']
})
export class RobotPopoverComponent {

  constructor(public uiService: UiControlService, public sceneService: SceneService, public generatorService: GeneratorApiService) {

  }

  addSensor(sensor: ISensor) {
    if (this.uiService.robotPopover) {
      sensor.link = this.uiService.robotPopover.selectedLink.name;
      this.sceneService.addSensor(this.uiService.robotPopover.robot, sensor);
      this.uiService.robotPopover = null;
    }
  }

}
