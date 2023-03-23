import { Environment, IEnvironment } from "../environment";
import { ConfigIoResult } from "./config-io-result";
import { ConfigParamUtils } from "./config-params";
import { ConfigRobotNode } from "./config-robot-node";
import { ConfigWorldNode } from "./config-world-node";

export type ConfigEnvNode = {
  robots: ConfigRobotNode[];
  world: ConfigWorldNode;
};

export function parseEnvironment(env: IEnvironment, configEnv?: ConfigEnvNode): ConfigIoResult<Environment> {
  const output = new ConfigIoResult<Environment>();

  const envDef = structuredClone(env);

  const params = ConfigParamUtils.getParams(envDef.params!, configEnv ?? {});;
  output.withMessages(params.messages, `Environment: `);
  envDef.params = params.data;

  return output.withData(new Environment(envDef));
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