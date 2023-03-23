import { Injectable, NgZone } from '@angular/core';
import {
  ConfigEnvNode,
  exportEnvironment,
  parseEnvironment,
} from 'src/app/models/config/config-env-node';
import { GroupNode, GroupType } from 'src/app/models/group';
import { Parameters } from 'src/app/models/parameters';
import { SceneNode } from 'src/app/models/scene-node';
import * as YAML from 'js-yaml';
import { GeneratorApiService } from './generator.api.service';
import { Robot, Sensor } from 'src/app/models/robot';
import * as THREE from 'three';
import { ToastService } from './toast.service';
import {
  ConfigRobotNode,
  exportRobot,
  parseRobot,
} from 'src/app/models/config/config-robot-node';
import {
  ConfigSensorNode,
  exportSensor,
  parseSensor,
} from 'src/app/models/config/config-sensor-node';
import { SceneService } from './scene.service';
import { UiControlService } from './ui-control.service';
import {
  ConfigGoalNode,
  exportGoal,
  parseGoal,
} from 'src/app/models/config/config-goal-node';
import { Goal } from 'src/app/models/goal';
import { Environment } from 'src/app/models/environment';
import {
  ConfigObstacleNode,
  exportObstacle,
  parseObstacles,
} from 'src/app/models/config/config-obstacle-node';
import { Obstacle } from 'src/app/models/obstacle';
import { ConfigVec3 } from 'src/app/models/config/config-vec3';
import { Trajectory } from 'src/app/models/trajectory';
import { Marker } from 'src/app/models/marker';
import { Config } from 'src/app/models/config/config';
import { ConfigUtils } from 'src/app/models/config/config-utils';
import { ConfigIoMessage, ConfigIoMsgType, ConfigIoResult } from 'src/app/models/config/config-io-result';
import { SceneObject } from 'src/app/models/scene-object';

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

  exportConfig() {
    try {
      if (!this.sceneService.rootNode) {
        return;
      }
      const env = exportEnvironment(this.sceneService.rootNode as Environment);

      const bbox = new THREE.Box3().setFromObject(
        this.sceneService.rootNode.ref.value
      );
      env.world.config.workspace_boundaries = [
        bbox.min.x,
        bbox.max.x,
        bbox.min.y,
        bbox.max.y,
        bbox.min.z,
        bbox.max.z,
      ];

      this.sceneService.robotGroup?.children
        .map((x) => x as Robot)
        .forEach((robot) => {
          const configRobot = exportRobot(robot);
          configRobot.sensors = robot.children
            .filter((x) => x instanceof Sensor)
            .map((x) => exportSensor(x as Sensor));

          const goal = robot.children.find((x) => x instanceof Goal) as Goal;
          if (goal) {
            configRobot.goal = exportGoal(goal);
          }
          env.robots.push(configRobot);
        });

      env.world.config.obstacles =
        this.sceneService.obstacleGroup?.children.map((x) =>
          exportObstacle(x as Obstacle)
        ) ?? [];

      const out = YAML.dump({ env });
      this.downloadYAML(out);
    } catch (e) {
      this.toast.error(`An error occured: ${e}`);
    }
  }

  downloadYAML(yaml: string) {
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = 'config.yaml';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  showMessages (messages: ConfigIoMessage[]) {
    messages.forEach(msg => {
      switch(msg.type) {
        case ConfigIoMsgType.SUCCESS:
          return this.toast.success(msg.message, 'Success');
        case ConfigIoMsgType.WARNING:
          return this.toast.warning(msg.message, 'Warning');
        case ConfigIoMsgType.ERROR:
          return this.toast.error(msg.message, 'Error');
      }
    })
  }

  parseConfig(configStr?: string) {
    const output = new ConfigIoResult<Environment>();
    try {
      const data = configStr
        ? (YAML.load(configStr, { json: true }) as Config)
        : undefined;

      if (configStr && !data) {
        throw `YAML Parse error`;
      }

      const parsedEnvironment = parseEnvironment(
        this.apiService.environment!,
        data?.env
      );
      output.withMessages(parsedEnvironment.messages);
      output.withData(parsedEnvironment.data!);

      const robots: GroupNode = new GroupNode({
        name: 'Robots',
        type: GroupType.Robots,
      });
      output.data?.addChild(robots);

      // Parse robots
      data?.env.robots.forEach((robotNode) => {
        const parsedRobot = parseRobot(this.apiService.robots, robotNode);
        output.withMessages(parsedRobot.messages);

        const parsedSensors = robotNode.sensors?.map((sensorNode) => {
          const parsedSensor = parseSensor(this.apiService.sensors, sensorNode);
          output.withMessages(parsedSensor.messages);

          return parsedSensor.data;
        });
        parsedSensors?.filter(x => !!x).forEach((sensor) => parsedRobot.data?.addChild(sensor!));

        if (robotNode.goal) {
          const parsedGoal = parseGoal(this.apiService.goals, robotNode.goal);
          output.withMessages(parsedGoal.messages);

          if (parsedGoal.data) {
              parsedRobot.data?.addChild(parsedGoal.data);
          }
        }

        if (parsedRobot.data) {
            robots.addChild(parsedRobot.data);
        }
      });

      const obstacles: GroupNode = new GroupNode({
        name: 'Obstacles',
        type: GroupType.Obstacles,
      });
      output.data?.addChild(obstacles);

      data?.env.world.config.obstacles?.forEach((obstacleNode) => {
        const obstacle = parseObstacles(
          this.apiService.obstacles,
          obstacleNode
        );
        output.withMessages(obstacle.messages);

        ConfigUtils.parseTrajectories(obstacle.data?.params ?? []).forEach((trj) =>
          obstacle.data?.addChild(trj)
        );

        if (obstacle.data) {
            obstacles.addChild(obstacle.data);
        }
      });

      this.uiService.selectNode(null);

      // Fix for refs not updating properly
      setTimeout(() => (this.sceneService.rootNode = undefined), 0);
      setTimeout(() => (this.sceneService.rootNode = output.data), 0);
    } catch (e) {
      console.error(e);
      output.withMessage(new ConfigIoMessage(`An unknown error occured: ${e}`, ConfigIoMsgType.ERROR));
    }
    this.showMessages(output.messages);
  }
}
