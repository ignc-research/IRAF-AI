import { ConfigVec3 } from "./config-vec3";

export type ConfigObstacleNode = {
  type: string;
  position: ConfigVec3;
  rotation: ConfigVec3;
  scale: number;
  params: any;
};
