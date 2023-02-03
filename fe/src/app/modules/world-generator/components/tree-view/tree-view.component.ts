import { Component } from '@angular/core';
import { SceneService } from '../../services/scene.service';
import { UiControlService } from '../../services/ui-control.service';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent {
  constructor(public sceneService: SceneService, public uiService: UiControlService) {

  }
}
