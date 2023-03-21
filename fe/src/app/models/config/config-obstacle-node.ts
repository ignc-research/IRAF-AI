import { NgtVector3 } from "@angular-three/core";
import { Marker } from "../marker";
import { IObstacle, Obstacle } from "../obstacle";
import { Parameters } from "../parameters";
import { Trajectory } from "../trajectory";
import { ConfigParams } from "./config-params";
import { ConfigUtils } from "./config-utils";
import { ConfigVec3 } from "./config-vec3";

export type ConfigObstacleNode = {
  type: string;
  position: ConfigVec3;
  rotation: ConfigVec3;
  scale: number;
  urdf?: string;
  params: Parameters;
};


export function parseObstacles(obstacles: IObstacle[], obstacleNode: ConfigObstacleNode) {

  let obstacleDef = structuredClone(obstacles.find((x) => x.type == obstacleNode.type));

  if (obstacleDef && obstacleDef.params) {
    obstacleDef.urdf = obstacleNode.urdf ?? obstacleDef.urdf;
    obstacleDef.params = ConfigParams.getParams(
      obstacleDef.params,
      obstacleNode.params
    );
    obstacleDef.name = obstacleNode.type;
    obstacleDef.position = ConfigUtils.getThreeVec3(obstacleNode.position);
    obstacleDef.rotation = ConfigUtils.getThreeEuler(obstacleNode.rotation);
    obstacleNode.scale = obstacleNode.scale ?? 1;
    obstacleDef.scale = ConfigUtils.getThreeVec3([obstacleNode.scale, obstacleNode.scale, obstacleNode.scale]);
    return new Obstacle(obstacleDef);
  } else {
    throw `Config contains unknown obstacle type: ${
        obstacleNode.type
      }. Known obstacle types are ${obstacles
        .map((x) => x.type)
        .join(', ')}`;
  }
  
}

export function exportObstacle( obstacle: Obstacle): ConfigObstacleNode {
  ConfigUtils.updateTrajectoryParams(obstacle, obstacle.params ?? {});
  return {
    type: obstacle.type,
    urdf: obstacle.urdf,
    position: ConfigUtils.getConfigVec3(obstacle.position),
    rotation: ConfigUtils.getConfigEuler(obstacle.rotation),
    scale: obstacle.scale.x,
    params: ConfigParams.exportParams(obstacle.params)
  }
}