import { Component, Input } from '@angular/core';
import { GroupNode } from 'src/app/models/group';
import { Marker } from 'src/app/models/marker';
import { Obstacle } from 'src/app/models/obstacle';
import { Robot, Sensor } from 'src/app/models/robot';
import { SceneNode } from 'src/app/models/scene-node';
import { SceneObject } from 'src/app/models/scene-object';

@Component({
  selector: 'app-scene-node',
  templateUrl: './scene-node.component.html',
  styleUrls: ['./scene-node.component.scss']
})
export class SceneNodeComponent {
  @Input()
  sceneNode!: SceneNode;

  get robot() {
    return this.sceneNode instanceof Robot;
  }

  get obstacle() {
    return this.sceneNode instanceof Obstacle;
  }

  get sensor() {
    return this.sceneNode instanceof Sensor;
  }

  get group() {
    return this.sceneNode instanceof GroupNode;
  }
  
  get marker() {
    return this.sceneNode instanceof Marker;
  }
}
