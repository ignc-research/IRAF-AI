import { Environment, IEnvironment } from "../environment";
import { ConfigParamUtils } from "./config-params";
import { ConfigRobotNode } from "./config-robot-node";
import { ConfigVec3 } from "./config-vec3";
import { ConfigWorldNode } from "./config-world-node";

export type ConfigEnvNode = {
  robots: ConfigRobotNode[];
  world: ConfigWorldNode;
};

export function parseEnvironment(env: IEnvironment, configEnv?: ConfigEnvNode) {
  const envDef = structuredClone(env);
  console.log(envDef)
  envDef.params = ConfigParamUtils.getParams(envDef.params!, configEnv ?? {});
  console.log(envDef.params)
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
    ...ConfigParamUtils.exportParams(env.params)
  };
}