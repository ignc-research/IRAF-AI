import { GroupNode, GroupType } from "../models/group";
import { ConfigRobotNode } from "./config-robot-node";
import { ConfigVec3 } from "./config-vec3";
import { ConfigWorldNode } from "./config-world-node";

export type ConfigEnvNode = {
  max_steps_per_episode: number;
  normalize_observations: boolean;
  normalize_rewards: boolean;
  stat_buffer_size: number;
  engine: ConfigEngineNode;
  robots: ConfigRobotNode[];
  world: ConfigWorldNode;
};

export type ConfigEngineNode = {
  gravity: ConfigVec3;
  sim_step: number;
  sim_steps_per_env_step: number;
  type: 'Pybullet';
  use_physics_sim: boolean;
};