import { Environment, IEnvironment } from "../environment";
import { ConfigParams } from "./config-params";
import { ConfigRobotNode } from "./config-robot-node";
import { ConfigVec3 } from "./config-vec3";
import { ConfigWorldNode } from "./config-world-node";

export type ConfigEnvNode = {
  robots: ConfigRobotNode[];
  world: ConfigWorldNode;
};

export function parseEnvironment(env: IEnvironment, configEnv?: ConfigEnvNode) {
  if (!configEnv) {
    throw "Environment node missing";
  }
  const envDef = structuredClone(env);
  envDef.params = ConfigParams.getParams(envDef.params!, configEnv);
  return new Environment(envDef);
}

export function exportEnvironment(env: Environment): ConfigEnvNode {
  return {
    robots: [],
    world: {
      type: 'Generated',
      config: {
        // ToDo: WORKSPACE BOUNDARIES
        workspace_boundaries: [0,0,0,0,0,0],
        obstacles: []
      }
    },
    ...ConfigParams.exportParams(env.params)
  };
}