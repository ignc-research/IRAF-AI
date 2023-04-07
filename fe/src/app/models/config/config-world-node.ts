import { ConfigObstacleNode } from "./config-obstacle-node";

export type ConfigWorldNode = {
  type: string;
  config: {
    workspace_boundaries: [number, number, number, number, number, number];
    obstacles: ConfigObstacleNode[]
  }
}