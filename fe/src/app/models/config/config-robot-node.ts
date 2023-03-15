import * as THREE from 'three';
import { Parameters } from '../parameters';
import { IRobot, Robot } from '../robot';
import { ConfigGoalNode } from './config-goal-node';
import { ConfigParams } from './config-params';
import { ConfigSensorNode } from './config-sensor-node';
import { ConfigUtils } from './config-utils';
import { ConfigVec3 } from './config-vec3';

export type ConfigRobotNode = {
  sensors: ConfigSensorNode[];
  goal?: ConfigGoalNode;
  config: {
    base_orientation: ConfigVec3;
    base_position: ConfigVec3;
    name: string;
  };
  type: string;
};

export function parseRobot(robots: IRobot[], robotNode: ConfigRobotNode) {
  const robotDef = structuredClone(
    robots.find((x) => x.type == robotNode.type)
  );
  if (robotDef && robotDef.params) {
    robotDef.params = ConfigParams.getParams(robotDef.params, robotNode.config);
    robotDef.position = ConfigUtils.getThreeVec3(robotNode.config.base_position);
    robotDef.rotation = ConfigUtils.getThreeEuler(
      robotNode.config.base_orientation
    );
    robotDef.name = robotNode.config.name;
    return new Robot(robotDef);
  } else {
    throw `Config contains unknown robot type: ${
        robotNode.type
      }. Known robot types are ${robots
        .map((x) => x.type)
        .join(', ')}`;
  }
}

export function exportRobot(robot: Robot): ConfigRobotNode {
  return {
    type: robot.type,
    config: {
      base_orientation: ConfigUtils.getConfigEuler(robot.rotation),
      base_position: ConfigUtils.getConfigVec3(robot.position),
      name: robot.name,
      ...ConfigParams.exportParams(robot.params)
    },
    sensors: [],
    goal: {} as any
  }
}