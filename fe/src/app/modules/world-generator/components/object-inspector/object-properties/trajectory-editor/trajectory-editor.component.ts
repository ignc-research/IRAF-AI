import { Component, Input } from '@angular/core';
import { Parameters } from 'src/app/models/parameters';
import { SceneNode } from 'src/app/models/scene-node';
import { SceneService } from 'src/app/modules/world-generator/services/scene.service';

@Component({
  selector: 'app-trajectory-editor',
  templateUrl: './trajectory-editor.component.html',
  styleUrls: ['./trajectory-editor.component.scss']
})
export class TrajectoryEditorComponent {
  @Input()
  sceneNode!: SceneNode;

  constructor(public sceneService: SceneService) {}  
}
