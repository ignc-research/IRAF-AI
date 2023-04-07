import { URDFRobot } from 'libs/urdf-loader/URDFClasses';
import { NumberUtils } from 'src/app/helpers/number-utils';
import * as THREE from 'three';
import { Parameters } from '../parameters';
import { IRobot, Robot } from '../robot';
import { ConfigGoalNode } from './config-goal-node';
import { ConfigIoMessage, ConfigIoMsgType, ConfigIoResult } from './config-io-result';
import { ConfigParamUtils } from './config-params';
import { ConfigSensorNode } from './config-sensor-node';
import { ConfigUtils } from './config-utils';
import { ConfigVec3 } from './config-vec3';

export type ConfigRobotNode = {
  sensors: ConfigSensorNode[];
  goal?: ConfigGoalNode;
  config: {
    base_orientation: ConfigVec3;
    base_position: ConfigVec3;
    resting_angles?: number[];
    name: string;
  };
  type: string;
};

export function parseRobot(robots: IRobot[], robotNode: ConfigRobotNode): ConfigIoResult<Robot> {
  const output = new ConfigIoResult<Robot>();

  const robotDef = structuredClone(
    robots.find((x) => x.type == robotNode.type)
  );
  if (robotDef && robotDef.params) {
    const params = ConfigParamUtils.getParams(robotDef.params, robotNode.config);
    output.withMessages(params.messages, `Robot ${robotDef.type}: `);

    robotDef.params = params.data;
    robotDef.position = ConfigUtils.getThreeVec3(robotNode.config.base_position);
    robotDef.rotation = ConfigUtils.getThreeEuler(
      robotNode.config.base_orientation
    );
    robotDef.name = robotNode.config.name;
    robotDef.resting_angles = robotNode.config.resting_angles?.map(NumberUtils.deg2Rad);
    output.withData(new Robot(robotDef));
  } else {
    output.withMessage(new ConfigIoMessage(`Config contains unknown robot type: ${
        robotNode.type
      }. Known robot types are ${robots
        .map((x) => x.type)
        .join(', ')}`, ConfigIoMsgType.ERROR));
  }

  return output;
}

export function exportRobot(robot: Robot): ConfigRobotNode {

  return {
    type: robot.type,
    config: {
      base_orientation: ConfigUtils.getConfigEuler(robot.rotation),
      base_position: ConfigUtils.getConfigVec3(robot.position),
      resting_angles: robot.resting_angles?.map(NumberUtils.rad2Deg),
      name: robot.name,
      ...ConfigParamUtils.exportParams(robot.params)
    },
    sensors: [],
    goal: {} as any
  }
}