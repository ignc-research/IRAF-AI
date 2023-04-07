import { Injectable } from '@angular/core';
import { StringUtils } from 'src/app/helpers/string-utils';
import { Goal, IGoal } from 'src/app/models/goal';
import { GroupNode, GroupType } from 'src/app/models/group';
import { Marker } from 'src/app/models/marker';
import { IObstacle, Obstacle } from 'src/app/models/obstacle';
import { IRobot, ISensor, Robot, Sensor } from 'src/app/models/robot';
import { SceneNode } from 'src/app/models/scene-node';
import { Trajectory } from 'src/app/models/trajectory';
import * as THREE from 'three';
import { GeneratorApiService } from './generator.api.service';


@Injectable({
  providedIn: 'root'
})
export class SceneService {
  rootNode?: SceneNode;

  get obstacleGroup() {
    return this.findRecursive((item: SceneNode) => item instanceof GroupNode && item.type == GroupType.Obstacles)
  }

  get robotGroup() {
    return this.findRecursive((item) => item instanceof GroupNode && item.type == GroupType.Robots)
  }

  constructor(private apiService: GeneratorApiService) {
  }

  getLastIndex = (objs: THREE.Object3D[], prefix: string) => (objs.filter(x => x.name.startsWith(prefix))
                                                                  .map(x => +(x.name.split('_').at(-1) ?? 0))
                                                                  .sort((a, b) => b - a)[0] ?? 0)

  findRecursive(condition: (item: SceneNode) => boolean, item: SceneNode=this.rootNode!): SceneNode | null {
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

  async addRobot(robot: IRobot) {
    const robotObj = new Robot(robot);
    this.robotGroup?.addChild(robotObj);
    this.addGoal(robotObj, this.apiService.goals[0]);
  }

  addTrajectoryPoint(object: SceneNode, name: string) {
    let trj = object.children.find(x => x instanceof Trajectory && x.name == name) as Trajectory;
    if (!trj) {
      trj = new Trajectory({ name });
      object.addChild(trj);
    }
    trj.addChild(new Marker({ name: trj.children.length.toString(), scale: new THREE.Vector3(.1,.1,.1) }));
  }

  addSensor(robot: Robot, sensorDef: ISensor) {
    const sensor = new Sensor({ ...sensorDef, name: sensorDef.type });
    robot.addChild(sensor);
  }

  addGoal(robot: Robot, goalDef: IGoal) {
    robot.children.filter(x => x instanceof Goal).forEach(x => robot.removeChild(x));
    robot.addChild(new Goal(goalDef));
  }

  invalidateRefs() {
    this.rootNode?.invalidateRef();
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
