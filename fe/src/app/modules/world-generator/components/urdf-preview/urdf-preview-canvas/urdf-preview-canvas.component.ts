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
  _urdfPath: string | null = '';
  robot!: URDFRobot | null;
  hasError: boolean = false;
  @Input()
  set urdfPath(value: string | null) {
    if (value != this._urdfPath) {
      this.robot = null;
    }
    if (value) {
      new AdvancedUrdfLoader().loadUrdf(value).then(x => {
         this.robot = x;
         this.hasError = false;
        }).catch(err => {
          this.robot = null;
          this.hasError = true;
          console.error("URDF LOADING FAILED", err);
      });
    }
    this._urdfPath = value;
  }

  get urdfPath() {
    return this._urdfPath;
  }

  constructor(private sceneService: SceneService) {

  }
}
