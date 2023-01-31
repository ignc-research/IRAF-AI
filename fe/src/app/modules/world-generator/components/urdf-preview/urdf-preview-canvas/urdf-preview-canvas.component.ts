import { Component, Input } from '@angular/core';
import { AdvancedUrdfLoader } from 'src/app/helpers/advanced-urdf-loader';
import { URDFRobot } from 'urdf-loader';
import { SceneService } from '../../../services/scene.service';

@Component({
  selector: 'app-urdf-preview-canvas',
  templateUrl: './urdf-preview-canvas.component.html',
  styleUrls: ['./urdf-preview-canvas.component.scss']
})
export class UrdfPreviewCanvasComponent {
  _urdfPath: string = '';
  robot!: URDFRobot;
  
  @Input()
  set urdfPath(value: string) {
    if (value) {
      new AdvancedUrdfLoader().loadRobot(value).then(x => this.robot = x);
    }
    this._urdfPath = value;
  }

  get urdfPath() {
    return this._urdfPath;
  }

  constructor(private sceneService: SceneService) {

  }
}
