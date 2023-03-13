import * as THREE from 'three';
import { GroupNode, GroupType } from '../models/group';
import { Parameters } from '../models/parameters';
import { IRobot, Robot } from '../models/robot';
import { ConfigGoalNode } from './config-goal-node';
import { ConfigSensorNode } from './config-sensor-node';
import { ConfigVec3 } from './config-vec3';

export type ConfigRobotNode = {
  sensors: ConfigSensorNode[];
  goal: ConfigGoalNode;
  config: {
    base_orientation: ConfigVec3;
    base_position: ConfigVec3;
    name: string;
  };
  type: string;
};
