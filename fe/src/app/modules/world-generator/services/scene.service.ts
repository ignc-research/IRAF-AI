import { NgtInstance, NgtObject, Ref } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { URDFLink, URDFRobot } from 'libs/urdf-loader/URDFLoader';

import { AdvancedUrdfLoader } from 'src/app/helpers/advanced-urdf-loader';
import { StringUtils } from 'src/app/helpers/string-utils';
import { getObstacleUrl, ObstacleDefinition } from 'src/app/models/obstacle';
import { environment } from 'src/environment/environment';
import * as THREE from 'three';
import { LoadingManager } from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  obstacles: THREE.Object3D[] = [];

  robots: Robot[] = [];

  constructor() { }

  getLastIndex = (objs: THREE.Object3D[], prefix: string) => (objs.filter(x => x.name.startsWith(prefix))
                                                                  .map(x => +(x.name.split('_').at(-1) ?? 0))
                                                                  .sort((a, b) => b - a)[0] ?? 0)
                                                                  
  async addObstacle(obstacle: ObstacleDefinition) {
    const obstacleObj = await new AdvancedUrdfLoader().loadUrdf(getObstacleUrl(obstacle));
    obstacleObj.userData = {
      "type": "Obstacle",
      "urdf": getObstacleUrl(obstacle),
      "params": obstacle.params
    };
    const name = StringUtils.getFileNameWithoutExt(getObstacleUrl(obstacle));
    const newIndex = this.getLastIndex(this.obstacles, name) + 1;
    obstacleObj.name = `${name}_${newIndex}`;

    this.obstacles.push(obstacleObj);
  }

  async addRobot(urdfPath: string) {
    const robot = await new AdvancedUrdfLoader().loadUrdf(urdfPath);
    robot.userData = {
      "type": "Robot",
      "urdf": urdfPath
    };
    const newIndex = this.getLastIndex(this.robots.map(x => x.robot), StringUtils.getFileNameWithoutExt(urdfPath)) + 1;
    robot.name = `${StringUtils.getFileNameWithoutExt(urdfPath)}_${newIndex}`;

    this.robots.push({
      robot,
      sensors: []
    });
  }

  addSensor(robot: Robot, link: URDFLink) {
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00
    });
    const sensor = new THREE.Mesh(geometry, material);
    const newIndex = this.getLastIndex(robot.sensors.map(x => x.sensor), "Sensor") + 1;
    sensor.name = `${"Sensor"}_${newIndex}`;
    sensor.userData = {
      "type": "Sensor",
      "link": link.name
    };
    robot.sensors.push({
      link: link,
      sensor: sensor
    });
  }

  deleteRobot(uuid: string) {
    const findRobot = this.robots.find(x => x.robot.uuid == uuid);
    if (findRobot) {
      const robotLinks = Object.values(findRobot.robot.links);
      this.robots = this.robots.filter(x => x.robot.uuid != uuid);
    }
  }

  deleteSensor(visualObjUuid: string) {
    this.robots.forEach(robot => {
      robot.sensors = robot.sensors.filter(x => x.sensor.uuid != visualObjUuid);
    })
  }

  deleteObstacle(uuid: string) {
    this.obstacles = this.obstacles.filter(x => x.uuid != uuid);
  }

  async deleteSceneObject(object: THREE.Object3D) {
    switch (object.userData['type']) {
      case 'Sensor':
        this.deleteSensor(object.uuid);
        break;
      case 'Robot':
        this.deleteRobot(object.uuid);
        break;
      case 'Obstacle':
        this.deleteObstacle(object.uuid);
        break;
    }

  }
 
}



export type Robot = {
  robot: URDFRobot;
  sensors: Sensor[];
}

export type Sensor = {
  sensor: THREE.Object3D;
  link: URDFLink;
}

export type UserData = { [key: string]: any }