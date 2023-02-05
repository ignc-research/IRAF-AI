import { Injectable } from '@angular/core';
import { StringUtils } from 'src/app/helpers/string-utils';
import { IObstacle, Obstacle } from 'src/app/models/obstacle';
import { Robot, Sensor } from 'src/app/models/robot';
import { SceneNode } from 'src/app/models/scene-node';
import { SceneObject } from 'src/app/models/scene-object';
import { SceneObjectType } from 'src/app/models/scene-object-type';

import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  objects: SceneObject[] = [];

  get robots() {
    return this.objects.filter(x => x instanceof Robot) as Robot[];
  }

  get obstacles() {
    return this.objects.filter(x => x instanceof Obstacle) as Obstacle[];
  }

  constructor() { }

  getLastIndex = (objs: THREE.Object3D[], prefix: string) => (objs.filter(x => x.name.startsWith(prefix))
                                                                  .map(x => +(x.name.split('_').at(-1) ?? 0))
                                                                  .sort((a, b) => b - a)[0] ?? 0)
                                                                  
  async addObstacle(obstacle: IObstacle) {
    obstacle.name = StringUtils.getFileNameWithoutExt(obstacle.urdf);
    this.objects.push(new Obstacle(obstacle));
  }

  async addRobot(urdfPath: string) {
    this.objects.push(new Robot({ type: urdfPath, name: StringUtils.getFileNameWithoutExt(urdfPath) }));
  }

  addSensor(robot: Robot, link: string) {
    const sensor = new Sensor({ type: 'LiDAR', name: 'LiDAR', link });
    sensor.scale.set(.1, .1, .1);
    sensor.position.set(0, 0, 1);
    robot.children.push(sensor);
  }


  invalidateRefs() {
    this.objects.forEach(x => x.invalidateRef());
  }

  async updateSceneObject(object: SceneObject) {
    if (object instanceof Obstacle) {
      this.objects.splice(this.objects.indexOf(object), 1);
      this.objects.push(new Obstacle(object));
    }
    else if (object instanceof Robot) {
      this.objects.splice(this.objects.indexOf(object), 1);
      this.objects.push(new Robot(object));
    }
    else if (object instanceof Sensor) {
      this.objects.forEach(x => {
        x.children.splice(x.children.indexOf(object), 1);
        x.children.push(new Sensor(object));
      })
    }
  }

  async deleteSceneNode(object: SceneNode, from: SceneNode[]=this.objects) {
    const findIdx = from.indexOf(object);
    if (findIdx > -1) {
      from.splice(findIdx, 1);
      return;
    }
    from.forEach(x => this.deleteSceneNode(object, x.children));
  }
 
}




export type UserData = { [key: string]: any }