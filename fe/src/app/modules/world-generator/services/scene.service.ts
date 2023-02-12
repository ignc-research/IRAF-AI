import { Injectable } from '@angular/core';
import { ConfigUtils } from 'src/app/helpers/config-utils';
import { StringUtils } from 'src/app/helpers/string-utils';
import { GroupNode, GroupType } from 'src/app/models/group';
import { Marker } from 'src/app/models/marker';
import { IObstacle, Obstacle } from 'src/app/models/obstacle';
import { Robot, Sensor } from 'src/app/models/robot';
import { SceneNode } from 'src/app/models/scene-node';
import { Trajectory } from 'src/app/models/trajectory';

import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  rootNode: SceneNode;

  get obstacleGroup() {
    return this.findRecursive((item: SceneNode) => item instanceof GroupNode && item.type == GroupType.Obstacles)
  }

  get robotGroup() {
    return this.findRecursive((item) => item instanceof GroupNode && item.type == GroupType.Robots)
  }

  constructor() {
    this.rootNode = ConfigUtils.parseConfig();
  }

  getLastIndex = (objs: THREE.Object3D[], prefix: string) => (objs.filter(x => x.name.startsWith(prefix))
                                                                  .map(x => +(x.name.split('_').at(-1) ?? 0))
                                                                  .sort((a, b) => b - a)[0] ?? 0)

  findRecursive(condition: (item: SceneNode) => boolean, item: SceneNode=this.rootNode): SceneNode | null {
    if (condition(item)) {
      return item;
    }
    return item.children.find(x => this.findRecursive(condition, x)) ?? null;
  }

  async addObstacle(obstacle: IObstacle) {
    obstacle.name = StringUtils.getFileNameWithoutExt(obstacle.urdf);
    console.log(this.obstacleGroup);
    this.obstacleGroup?.addChild(new Obstacle(obstacle));
  }

  async addRobot(urdfPath: string) {
    this.robotGroup?.addChild(new Robot({ type: urdfPath, name: StringUtils.getFileNameWithoutExt(urdfPath) }));
  }

  addTrajectoryPoint(object: SceneNode, name: string) {
    let trj = object.children.find(x => x instanceof Trajectory && x.name == name) as Trajectory;
    if (!trj) {
      trj = new Trajectory({ name });
      object.addChild(trj);
    }
    trj.addChild(new Marker({ name: trj.children.length.toString(), scale: new THREE.Vector3(.1,.1,.1) }));
  }

  addSensor(robot: Robot, link: string) {
    const sensor = new Sensor({ type: 'LiDAR', name: 'LiDAR', link });
    sensor.scale.set(.1, .1, .1);
    sensor.position.set(0, 0, 1);
    robot.addChild(sensor);
  }


  invalidateRefs() {
    this.rootNode.invalidateRef();
  }

  // For refreshing a scene object, currently only used for obstacles with dynamic urdfs
  async updateSceneNode(node: SceneNode) {
    let newNode: SceneNode | null = null;
    if (node instanceof Obstacle) {
      newNode = new Obstacle(node);
    }
    if (node.parent && newNode) {
      node.parent.removeChild(node);
      node.parent.addChild(newNode);
    }
  }

  async deleteSceneNode(object: SceneNode) {
    if (object.parent && (!object.readonly || object instanceof Trajectory)) {
      object.parent.removeChild(object);
    } 
  }
}


export type Constructor<T> = new (...args: any[]) => T; 
