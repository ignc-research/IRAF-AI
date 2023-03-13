import { NgtVector3 } from "@angular-three/core";

export type Parameter = {
    type: 'int' | 'float' | 'bool' | 'string' | 'trajectory' | 'group' | 'vec3';
    value?: number | boolean | string | NgtVector3[];
    children?: Parameters;
}
  
export type Parameters = { [key: string]: Parameter }
  
  