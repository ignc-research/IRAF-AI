import { NgtInstance, NgtObject, Ref } from '@angular-three/core';
import { Injectable } from '@angular/core';

import { AdvancedUrdfLoader } from 'src/app/helpers/advanced-urdf-loader';
import { environment } from 'src/environment/environment';
import { LoadingManager } from 'three';
import URDFLoader, { URDFLink, URDFRobot } from 'urdf-loader';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  obstacles: THREE.Object3D[] = [];

  robots: Robot[] = [];

  constructor() { }

  async addObstacle(urdfPath: string) {
    const obstacle = await new AdvancedUrdfLoader().loadUrdf(urdfPath);
    obstacle.userData = {
      "type": "Obstacle",
      "urdf": urdfPath
    };

    this.obstacles.push(obstacle);
  }

  async addRobot(urdfPath: string) {
    const robot = await new AdvancedUrdfLoader().loadUrdf(urdfPath);
    robot.userData = {
      "type": "Robot",
      "urdf": urdfPath
    };

    this.robots.push({
      robot,
      sensors: []
    });
  }

  addSensor(robot: Robot, link: URDFLink) {
    robot.sensors.push({
      link: link,
      sensorRef: new Ref<THREE.Object3D>()
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
      robot.sensors = robot.sensors.filter(x => x.sensorRef.value.uuid != visualObjUuid);
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
  sensorRef: Ref<THREE.Object3D>;
  link: URDFLink;
}

export type UserData = { [key: string]: any }