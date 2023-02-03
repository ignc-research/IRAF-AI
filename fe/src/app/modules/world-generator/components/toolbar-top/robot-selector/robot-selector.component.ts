import { Component } from '@angular/core';
import { StringUtils } from 'src/app/helpers/string-utils';
import { GeneratorApiService } from '../../../services/generator.api.service';
import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-robot-selector',
  templateUrl: './robot-selector.component.html',
  styleUrls: ['./robot-selector.component.scss'],
})
export class RobotSelectorComponent {

  selectedRobot: string = '';

  constructor(public generatorApi: GeneratorApiService, private sceneService: SceneService) {

  }

  addRobot() {
    this.sceneService.addRobot(this.selectedRobot);
  }

  getFileName = StringUtils.getFileName;
}
