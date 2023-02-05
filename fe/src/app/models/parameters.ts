import { NgtVector3 } from "@angular-three/core";

export type Parameter = {
    type: 'int' | 'float' | 'bool' | 'string' | 'trajectory';
    value?: number | boolean | string | NgtVector3[]; 
}
  
export type Parameters = { [key: string]: Parameter }
  
  