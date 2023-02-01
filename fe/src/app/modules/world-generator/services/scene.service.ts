import { NgtInstance, NgtObject } from '@angular-three/core';
import { Injectable } from '@angular/core';

import { AdvancedUrdfLoader } from 'src/app/helpers/advanced-urdf-loader';
import { environment } from 'src/environment/environment';
import { LoadingManager } from 'three';
import URDFLoader, { URDFRobot } from 'urdf-loader';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  selectedObject: THREE.Object3D | null = null;

  robots: URDFRobot[] = [];

  constructor() { }

  async addRobot(urdfPath: string) {
    const robot = await new AdvancedUrdfLoader().loadRobot(urdfPath);
    robot.userData = {
      "type": "Robot",
      "urdf": urdfPath
    };

    this.robots.push(robot);
  }

  deleteRobot(uuid: string) {
    this.robots = this.robots.filter(x => x.uuid != uuid);
  }

  async deleteSceneObject(object: THREE.Object3D) {
    if (object == this.selectedObject) {
      this.selectedObject = null;
    }

    switch (object.userData['type'].value) {
      case 'Sensor':

        break;
      case 'Robot':
        this.deleteRobot(object.uuid);
        break;
    }

  }
 
}
export type UserData = { [key: string]: any }