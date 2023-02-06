import { Ref } from '@angular-three/core';
import { NgtSobaTransformControls } from '@angular-three/soba/controls';
import { AfterViewInit, ApplicationRef, Component, Input, NgZone, ViewChild } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { SceneObject } from 'src/app/models/scene-object';
import { SceneService } from '../../services/scene.service';
import { UiControlService } from '../../services/ui-control.service';

@Component({
  selector: 'app-transform-controls',
  templateUrl: './transform-controls.component.html',
  styleUrls: ['./transform-controls.component.scss']
})
export class TransformControlsComponent {
  @Input()
  controlledObject!: SceneObject | null;

  constructor(public uiService: UiControlService,
    private zone: NgZone) { }

  onControlsChange = (ev: any) => {
    const targetObj = ev.target.object;

    if (!targetObj || !this.controlledObject || targetObj != this.controlledObject.ref.value) {
      return;
    }

    if (ev.target.mode == "scale") {
      if (targetObj.scale.x != targetObj.scale.y && targetObj.scale.x != targetObj.scale.z) {
        targetObj.scale.set(targetObj.scale.x, targetObj.scale.x, targetObj.scale.x);
      }
      if (targetObj.scale.y != targetObj.scale.x && targetObj.scale.y != targetObj.scale.z) {
        targetObj.scale.set(targetObj.scale.y, targetObj.scale.y, targetObj.scale.y);
      }
      if (targetObj.scale.z != targetObj.scale.x && targetObj.scale.z != targetObj.scale.y) {
        targetObj.scale.set(targetObj.scale.z, targetObj.scale.z, targetObj.scale.z);
      }
    }
    // Update internal state
    this.controlledObject.position = targetObj.position;
    this.controlledObject.rotation = targetObj.rotation;
    this.controlledObject.scale = targetObj.scale;
    
    this.zone.run(() => null);
  }
}
