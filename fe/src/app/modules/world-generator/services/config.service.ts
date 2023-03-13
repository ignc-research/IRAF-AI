import { Injectable, NgZone } from '@angular/core';
import { ConfigEnvNode } from 'src/app/helpers/config-env-node';
import { Config } from 'src/app/helpers/config-utils';
import { GroupNode, GroupType } from 'src/app/models/group';
import { Parameters } from 'src/app/models/parameters';
import { SceneNode } from 'src/app/models/scene-node';
import * as YAML from 'js-yaml';
import { GeneratorApiService } from './generator.api.service';
import { Robot, Sensor } from 'src/app/models/robot';
import * as THREE from 'three';
import { ToastService } from './toast.service';
import { ConfigRobotNode } from 'src/app/helpers/config-robot-node';
import { ConfigSensorNode } from 'src/app/helpers/config-sensor-node';
import { SceneService } from './scene.service';
import { UiControlService } from './ui-control.service';
import { ConfigGoalNode } from 'src/app/helpers/config-goal-node';
import { Goal } from 'src/app/models/goal';
import { Environment } from 'src/app/models/environment';
import { ConfigObstacleNode } from 'src/app/helpers/config-obstacle-node';
import { Obstacle } from 'src/app/models/obstacle';
import { ConfigVec3 } from 'src/app/helpers/config-vec3';
import { Trajectory } from 'src/app/models/trajectory';
import { Marker } from 'src/app/models/marker';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    private apiService: GeneratorApiService,
    private zone: NgZone,
    private toast: ToastService,
    private sceneService: SceneService,
    private uiService: UiControlService
  ) {}

  getThreeVec3(configVec: ConfigVec3) {
    return new THREE.Vector3(...configVec);
  }

  getThreeEuler(configEuler: ConfigVec3) {
    return new THREE.Euler(...configEuler.map((x) => x * (Math.PI / 180.0)));
  }

  getParams(
    paramDef: Parameters,
    configDict: { [key: string]: any }
  ): Parameters {
    const newParams = { ...paramDef };
    console.log(newParams, configDict);
    Object.keys(paramDef).forEach((paramKey) => {
      if (newParams[paramKey].type == 'group') {
        newParams[paramKey].children = this.getParams(
          newParams[paramKey].children!,
          configDict ? configDict[paramKey] : {}
        );
        return;
      }
      if (newParams[paramKey].type == 'trajectory') {
        return;
      }
      if (configDict && configDict[paramKey]) {
        newParams[paramKey].value = configDict[paramKey];
      }
    });
    return newParams;
  }

  parseGoal(configGoal: ConfigGoalNode) {
    const goalDef = structuredClone(
      this.apiService.goals.find((x) => x.type == configGoal.type)
    );
    if (goalDef && goalDef.params) {
      goalDef.params = this.getParams(goalDef.params, configGoal.config);
      goalDef.name = configGoal.type;

      return new Goal(goalDef);
    } else {
      this.toast.error(
        `Config contains unknown goal type: ${
          configGoal.type
        }. Known goal types are ${this.apiService.goals
          .map((x) => x.type)
          .join(', ')}`
      );
    }
    return null;
  }

  parseSensors(configSensors: ConfigSensorNode[]) {
    const sensors: Sensor[] = [];

    configSensors.forEach((sensorNode) => {
      const sensorDef = structuredClone(
        this.apiService.sensors.find((x) => x.type == sensorNode.type)
      );
      if (sensorDef && sensorDef.params) {
        sensorDef.params = this.getParams(sensorDef.params, sensorNode.config);
        sensorDef.name = sensorNode.type;

        sensors.push(new Sensor(sensorDef));
      } else {
        this.toast.error(
          `Config contains unknown sensor type: ${
            sensorNode.type
          }. Known sensor types are ${this.apiService.sensors
            .map((x) => x.type)
            .join(', ')}`
        );
      }
    });
    return sensors;
  }

  parseRobots(configRobots: ConfigRobotNode[]) {
    const robots: Robot[] = [];

    configRobots.forEach((robotNode) => {
      const robotDef = structuredClone(
        this.apiService.robots.find((x) => x.type == robotNode.type)
      );
      if (robotDef && robotDef.params) {
        robotDef.params = this.getParams(robotDef.params, robotNode.config);
        robotDef.position = this.getThreeVec3(robotNode.config.base_position);
        robotDef.rotation = this.getThreeEuler(
          robotNode.config.base_orientation
        );
        robotDef.name = robotNode.config.name;
        const robot = new Robot(robotDef);

        this.parseSensors(robotNode.sensors).forEach((x) => robot.addChild(x));
        const goal = this.parseGoal(robotNode.goal);
        if (goal) {
          robot.addChild(goal);
        }

        robots.push(robot);
      } else {
        this.toast.error(
          `Config contains unknown robot type: ${
            robotNode.type
          }. Known robot types are ${this.apiService.robots
            .map((x) => x.type)
            .join(', ')}`
        );
      }
    });

    return robots;
  }

  parseTrajectories(
    parameters: Parameters,
    configDict: { [key: string]: any }
  ) {
    const trajectories: Trajectory[] = [];
    Object.keys(parameters).forEach((x) => {
      if (parameters[x].type == 'trajectory' && configDict[x]) {
        const trj = new Trajectory({ name: x });
        configDict[x].forEach((point: ConfigVec3, idx: number) =>
          trj.addChild(
            new Marker({
              name: idx.toString(),
              position: this.getThreeVec3(point),
            })
          )
        );
        trajectories.push(trj);
      }
    });
    return trajectories;
  }

  parseObstacles(configObstacles: ConfigObstacleNode[]) {
    const obstacles: Obstacle[] = [];

    configObstacles.forEach((obstacleNode) => {
      const obstacleDef = structuredClone(
        this.apiService.obstacles.find((x) => x.type == obstacleNode.type)
      );
      if (obstacleDef && obstacleDef.params) {
        obstacleDef.params = this.getParams(
          obstacleDef.params,
          obstacleNode.params
        );
        obstacleDef.name = obstacleNode.type;
        obstacleDef.position = this.getThreeVec3(obstacleNode.position);
        obstacleDef.rotation = this.getThreeEuler(obstacleNode.rotation);
        const obstacle = new Obstacle(obstacleDef);
        this.parseTrajectories(obstacleDef.params, obstacleNode.params).forEach(
          (x) => obstacle.addChild(x)
        );
        obstacles.push(obstacle);
      } else {
        this.toast.error(
          `Config contains unknown obstacle type: ${
            obstacleNode.type
          }. Known obstacle types are ${this.apiService.obstacles
            .map((x) => x.type)
            .join(', ')}`
        );
      }
    });
    return obstacles;
  }

  parseEnvironment(configEnv: ConfigEnvNode) {
    const envDef = structuredClone(this.apiService.environment)!;
    envDef.params = this.getParams(envDef.params!, configEnv);
    return new Environment(envDef);
  }

  parseConfig(configStr?: string) {
    const data = configStr
      ? (YAML.load(configStr, { json: true }) as Config)
      : undefined;

    const rootNode = this.parseEnvironment(data?.env!);

    const robots: GroupNode = new GroupNode({
      name: 'Robots',
      type: GroupType.Robots,
    });
    const obstacles: GroupNode = new GroupNode({
      name: 'Obstacles',
      type: GroupType.Obstacles,
    });
    rootNode.addChild(robots);
    rootNode.addChild(obstacles);

    this.parseRobots(data?.env.robots ?? []).forEach((x) => robots.addChild(x));

    this.parseObstacles(data?.env.world.config.obstacles ?? []).forEach((x) =>
      obstacles.addChild(x)
    );

    this.uiService.selectNode(null);

    console.log(rootNode);

    // Fix for refs not updating properly
    setTimeout(() => (this.sceneService.rootNode = undefined), 0);
    setTimeout(() => (this.sceneService.rootNode = rootNode), 0);
  }
}
