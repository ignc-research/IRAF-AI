import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { URDFRobot } from 'urdf-loader';
import { SceneService } from '../../services/scene.service';

@Component({
  selector: 'app-object-inspector',
  templateUrl: './object-inspector.component.html',
  styleUrls: ['./object-inspector.component.scss']
})
export class ObjectInspectorComponent {
  get userData() {
    return this.sceneService.selectedObject?.userData ?? {};
  }

  get robot() {
    return this.sceneService.selectedObject as URDFRobot;
  }

  get objectType() {
    return this.userData['type'];
  }

  constructor(public sceneService: SceneService){
   
  }

}
