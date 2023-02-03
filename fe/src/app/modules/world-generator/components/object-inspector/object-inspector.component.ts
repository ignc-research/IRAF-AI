import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { URDFRobot } from 'urdf-loader';
import { SceneService } from '../../services/scene.service';
import { UiControlService } from '../../services/ui-control.service';

@Component({
  selector: 'app-object-inspector',
  templateUrl: './object-inspector.component.html',
  styleUrls: ['./object-inspector.component.scss']
})
export class ObjectInspectorComponent {
  get userData() {
    return this.uiService.selectedObject?.userData ?? {};
  }

  get robot() {
    return this.uiService.selectedObject as URDFRobot;
  }

  constructor(public uiService: UiControlService){
   
  }

}
