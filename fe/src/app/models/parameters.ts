import { NgtVector3 } from "@angular-three/core";
import { ConfigColor } from "./config/config-color";
import { ConfigVec3 } from "./config/config-vec3";

export type Parameter = {
  key: string;
  type?: 'int' | 'float' | 'bool' | 'string' | 'trajectory' | 'vec3' | 'color';
  value?: ParameterValue;
  children?: Parameters;
  options?: ParameterOption[];
}
  
export type ParameterValue = number | boolean | string | ConfigVec3[] | ConfigVec3 | ConfigColor;

export type Parameters = Parameter[];
  
export type ParameterOption = {
  label?: string;
  value: ParameterValue;
}