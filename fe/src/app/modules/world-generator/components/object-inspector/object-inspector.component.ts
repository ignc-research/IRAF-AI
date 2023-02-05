import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { URDFRobot } from 'libs/urdf-loader/URDFLoader';
import { UiControlService } from '../../services/ui-control.service';

@Component({
  selector: 'app-object-inspector',
  templateUrl: './object-inspector.component.html',
  styleUrls: ['./object-inspector.component.scss']
})
export class ObjectInspectorComponent {

  get node() {
    return this.uiService.selectedNode;
  }

  get object() {
    return this.uiService.selectedObject;
  }

  constructor(public uiService: UiControlService){
   
  }

}
