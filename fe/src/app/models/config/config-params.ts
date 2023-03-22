import { Parameters } from "../parameters";

function getParams(
  paramDef: Parameters,
  configDict: { [key: string]: any }
): Parameters {
  const newParams: Parameters = [];

  structuredClone(paramDef).forEach((param) => { 
    if (param.children) {
      param.children = getParams(
        param.children!,
        configDict ? configDict[param.key] : {}
      );
    }
    else if (configDict && configDict[param.key]) {
      param.value = configDict[param.key];
    }
    newParams.push(param);
  });
  return newParams;
}

function exportParams(params: Parameters = []) {
  const paramsObject: { [key: string]: any } = {}; 
  params.forEach(param => {
    if (param.children) {
      paramsObject[param.key] = exportParams(param.children!);
      return;
    }
    paramsObject[param.key] = param.value;
  });
  return paramsObject;
}

export const ConfigParamUtils = {
  getParams,
  exportParams
}

export type ConfigParams = { [key: string]: any }