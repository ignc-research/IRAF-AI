import { NgtVector3 } from "@angular-three/core";
import { Marker } from "../marker";
import { IObstacle, Obstacle } from "../obstacle";
import { Parameters } from "../parameters";
import { Trajectory } from "../trajectory";
import { ConfigIoMessage, ConfigIoMsgType, ConfigIoResult } from "./config-io-result";
import { ConfigParamUtils } from "./config-params";
import { ConfigUtils } from "./config-utils";
import { ConfigVec3 } from "./config-vec3";

export type ConfigObstacleNode = {
  type: string;
  position: ConfigVec3;
  rotation: ConfigVec3;
  scale?: number;
  urdf?: string;
  params: { [key: string]: any };
};


export function parseObstacles(obstacles: IObstacle[], obstacleNode: ConfigObstacleNode): ConfigIoResult<Obstacle> {
  const output = new ConfigIoResult<Obstacle>();
  let obstacleDef = structuredClone(obstacles.find((x) => x.type == obstacleNode.type));

  if (obstacleDef && obstacleDef.params) {
    obstacleDef.urdf = obstacleNode.urdf ?? obstacleDef.urdf;
    const params = ConfigParamUtils.getParams(
      obstacleDef.params,
      obstacleNode.params
    );
    output.withMessages(params.messages, `Obstacle ${obstacleDef.type}: `);
    obstacleDef.params = params.data;
    obstacleDef.name = obstacleNode.type;
    obstacleDef.position = ConfigUtils.getThreeVec3(obstacleNode.position);
    obstacleDef.rotation = ConfigUtils.getThreeEuler(obstacleNode.rotation);
    obstacleDef.scale = ConfigUtils.getThreeVec3([obstacleNode.scale ?? 1, obstacleNode.scale ?? 1, obstacleNode.scale ?? 1]);
    output.withData(new Obstacle(obstacleDef));
  } else {
    output.withMessage(new ConfigIoMessage(`Config contains unknown obstacle type: ${
      obstacleNode.type
    }. Known obstacle types are ${obstacles
      .map((x) => x.type)
      .join(', ')}`, ConfigIoMsgType.ERROR));
  }
  return output;
}

export function exportObstacle( obstacle: Obstacle): ConfigObstacleNode {
  ConfigUtils.updateTrajectoryParams(obstacle, obstacle.params ?? []);
  return {
    type: obstacle.type,
    urdf: obstacle.urdf,
    position: ConfigUtils.getConfigVec3(obstacle.position),
    rotation: ConfigUtils.getConfigEuler(obstacle.rotation),
    scale: obstacle.scale.x,
    params: ConfigParamUtils.exportParams(obstacle.params)
  }
}