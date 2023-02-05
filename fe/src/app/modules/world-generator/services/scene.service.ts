import { Injectable } from '@angular/core';
import { StringUtils } from 'src/app/helpers/string-utils';
import { GroupNode } from 'src/app/models/group';
import { Marker } from 'src/app/models/marker';
import { IObstacle, Obstacle } from 'src/app/models/obstacle';
import { Robot, Sensor } from 'src/app/models/robot';
import { SceneNode } from 'src/app/models/scene-node';

import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private robots: GroupNode = new GroupNode({name: 'Robots'});
  private obstacles: GroupNode = new GroupNode({name: 'Obstacles'});

  nodes: SceneNode[];

  constructor() { 
    this.nodes = [this.robots, this.obstacles];
  }

  getLastIndex = (objs: THREE.Object3D[], prefix: string) => (objs.filter(x => x.name.startsWith(prefix))
                                                                  .map(x => +(x.name.split('_').at(-1) ?? 0))
                                                                  .sort((a, b) => b - a)[0] ?? 0)
                                                                  
  async addObstacle(obstacle: IObstacle) {
    obstacle.name = StringUtils.getFileNameWithoutExt(obstacle.urdf);
    this.obstacles.addChild(new Obstacle(obstacle));
  }

  async addRobot(urdfPath: string) {
    this.robots.addChild(new Robot({ type: urdfPath, name: StringUtils.getFileNameWithoutExt(urdfPath) }));
  }

  addTrajectoryPoint(object: SceneNode, name: string) {
    let trj = object.children.find(x => x instanceof GroupNode && x.name == name) as GroupNode;
    if (!trj) {
      trj = new GroupNode({ name });
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
    this.nodes.forEach(x => x.invalidateRef());
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
    if (object.parent) {
      object.parent.removeChild(object);
    } 
  }
}




export type UserData = { [key: string]: any }