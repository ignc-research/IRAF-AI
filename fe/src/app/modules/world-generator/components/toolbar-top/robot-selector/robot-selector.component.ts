import { Component } from '@angular/core';
import { StringUtils } from 'src/app/helpers/string-utils';
import { IRobot } from 'src/app/models/robot';
import { GeneratorApiService } from '../../../services/generator.api.service';
import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-robot-selector',
  templateUrl: './robot-selector.component.html',
  styleUrls: ['./robot-selector.component.scss'],
})
export class RobotSelectorComponent {

  selectedRobot?: IRobot;

  constructor(public generatorApi: GeneratorApiService, private sceneService: SceneService) {

  }

  addRobot() {
    if (this.selectedRobot) {
        this.sceneService.addRobot(this.selectedRobot);
    }
  }

  getFileName = StringUtils.getFileName;
}
