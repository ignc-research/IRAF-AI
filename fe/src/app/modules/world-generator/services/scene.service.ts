import { Injectable } from '@angular/core';
import { StringUtils } from 'src/app/helpers/string-utils';
import { IObstacle, Obstacle } from 'src/app/models/obstacle';
import { Robot, Sensor } from 'src/app/models/robot';
import { SceneObject } from 'src/app/models/scene-object';
import { SceneObjectType } from 'src/app/models/scene-object-type';

import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  obstacles: Obstacle[] = [];

  robots: Robot[] = [];

  constructor() { }

  getLastIndex = (objs: THREE.Object3D[], prefix: string) => (objs.filter(x => x.name.startsWith(prefix))
                                                                  .map(x => +(x.name.split('_').at(-1) ?? 0))
                                                                  .sort((a, b) => b - a)[0] ?? 0)
                                                                  
  async addObstacle(obstacle: IObstacle) {
    obstacle.name = StringUtils.getFileNameWithoutExt(obstacle.urdf);
    this.obstacles.push(new Obstacle(obstacle));
  }

  async addRobot(urdfPath: string) {
    this.robots.push(new Robot({ type: urdfPath, name: StringUtils.getFileNameWithoutExt(urdfPath) }));
  }

  addSensor(robot: Robot, link: string) {
    const sensor = new Sensor({ type: 'LiDAR', name: 'LiDAR', link });
    sensor.scale.set(.1, .1, .1);
    sensor.position.set(0, 0, 1);
    robot.sensors.push(sensor);
  }


  invalidateRefs() {
    this.obstacles.forEach(x => x.invalidateRef());
    this.robots.forEach(x => x.invalidateRef());
  }

  async updateSceneObject(object: SceneObject) {
    if (object instanceof Obstacle) {
      this.obstacles.splice(this.obstacles.indexOf(object), 1);
      this.obstacles.push(new Obstacle(object));
    }
    else if (object instanceof Robot) {
      this.robots.splice(this.robots.indexOf(object), 1);
      this.robots.push(new Robot(object));
    }
    else if (object instanceof Sensor) {
      this.robots.forEach(x => {
        x.sensors.splice(x.sensors.indexOf(object), 1);
        x.sensors.push(new Sensor(object));
      })
    }
  }

  async deleteSceneObject(object: SceneObject) {
    if (object instanceof Obstacle) {
      this.obstacles = this.obstacles.filter(x => x != object);
    }
    else if (object instanceof Robot) {
      this.robots = this.robots.filter(x => x != object);
    }
    else if (object instanceof Sensor) {
      this.robots.forEach(x => {
        x.sensors = x.sensors.filter(y => y != object);
      })
    }
  }
 
}




export type UserData = { [key: string]: any }