import { Parameters } from '../parameters';
import {
  ConfigIoMessage,
  ConfigIoMsgType,
  ConfigIoResult,
} from './config-io-result';

function getParams(
  paramDef: Parameters,
  configDict: { [key: string]: any }
): ConfigIoResult<Parameters> {
  const result = new ConfigIoResult<Parameters>();
  const newParams: Parameters = [];

  structuredClone(paramDef).forEach((param) => {
    if (param.children) {
      console.log(param)
      const children = getParams(
        param.children!,
        configDict ? configDict[param.key] : {}
      );
      result.withMessages(children.messages, `${param.key}: `);
      param.children = children.data;
    } else if (configDict && configDict[param.key] !== undefined) {
      param.value = configDict[param.key];
    } else {
      result.withMessage(
        new ConfigIoMessage(
          `Config is missing parameter: ${param.key}. It will be set after export.`,
          ConfigIoMsgType.WARNING
        )
      );
    }
    newParams.push(param);
  });

  // Detect parameters defined in config but not defined in backend definitions
  Object.keys(configDict ?? {})
    .filter((key) => !paramDef.map((param) => param.key).includes(key))
    .forEach(
      (key) =>
        new ConfigIoMessage(
          `Config has unknown parameter: ${key}. It will ignored and missing after export.`,
          ConfigIoMsgType.WARNING
        )
    );

  return result.withData(newParams);
}

function exportParams(params: Parameters = []) {
  const paramsObject: { [key: string]: any } = {};
  params.forEach((param) => {
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
  exportParams,
};

export type ConfigParams = { [key: string]: any };
