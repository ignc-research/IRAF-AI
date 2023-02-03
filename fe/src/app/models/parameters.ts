export type Parameter = {
    type: 'int' | 'float' | 'bool' | 'string';
    value?: number | boolean | string; 
}
  
export type Parameters = { [key: string]: Parameter }
  
  