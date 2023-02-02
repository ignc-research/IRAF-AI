import { Component } from '@angular/core';
import { GeneratorApiService } from '../../../services/generator.api.service';
import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-obstacle-selector',
  templateUrl: './obstacle-selector.component.html',
  styleUrls: ['./obstacle-selector.component.scss']
})
export class ObstacleSelectorComponent {
  selectedObstacle: string = '';

  constructor(public generatorApi: GeneratorApiService, private sceneService: SceneService) {

  }

  addObstacle() {
    this.sceneService.addObstacle(this.selectedObstacle);
  }

  getFileName = (path: string) => path.replace(/^.*[\\\/]/, '');
}
