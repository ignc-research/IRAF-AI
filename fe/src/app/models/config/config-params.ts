import { Parameters } from "../parameters";

function getParams(
  paramDef: Parameters,
  configDict: { [key: string]: any }
): Parameters {
  const newParams = { ...paramDef };

  Object.keys(paramDef).forEach((paramKey) => {
    if (newParams[paramKey].type == 'group') {
      newParams[paramKey].children = getParams(
        newParams[paramKey].children!,
        configDict ? configDict[paramKey] : {}
      );
      return;
    }
    if (configDict && configDict[paramKey]) {
      newParams[paramKey].value = configDict[paramKey];
    }
  });
  return newParams;
}

function exportParams(params: Parameters = {}) {
  const paramsObject: { [key: string]: any } = {}; 
  Object.keys(params).forEach(paramKey => {
    if (params[paramKey].type === 'group') {
      paramsObject[paramKey] = exportParams(params[paramKey].children!);
      return;
    }
    paramsObject[paramKey] = params[paramKey].value;
  });
  return paramsObject;
}

export const ConfigParams = {
  getParams,
  exportParams
}
