import { ConfigVec3 } from "./config-vec3";

export type ConfigSensorNode = {
  type: string;
  config: {
    position: ConfigVec3;
    rotation: ConfigVec3;
    link: string;
  };
};