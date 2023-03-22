import { Parameters } from "../parameters";
import { ISensor, Sensor } from "../robot";
import { ConfigParamUtils } from "./config-params";
import { ConfigUtils } from "./config-utils";
import { ConfigVec3 } from "./config-vec3";

export type ConfigSensorNode = {
  type: string;
  config: {
    position: ConfigVec3;
    rotation: ConfigVec3;
    link: string;
  };
};

export function parseSensor(sensors: ISensor[], sensorNode: ConfigSensorNode) {
  const sensorDef = structuredClone(
    sensors.find((x) => x.type == sensorNode.type)
  );
  if (sensorDef && sensorDef.params) {
    sensorDef.params = ConfigParamUtils.getParams(sensorDef.params, sensorNode.config);
    sensorDef.name = sensorNode.type;
    sensorDef.link = sensorNode.config.link;
    sensorDef.position = ConfigUtils.getThreeVec3(sensorNode.config.position);
    sensorDef.rotation = ConfigUtils.getThreeEuler(
      sensorNode.config.rotation
    );

    return new Sensor(sensorDef);
  } else {
    throw `Config contains unknown sensor type: ${
        sensorNode.type
      }. Known sensor types are ${sensors
        .map((x) => x.type)
        .join(', ')}`;
  }
}

export function exportSensor(sensor: Sensor): ConfigSensorNode {
  return {
    type: sensor.type,
    config: {
      position: ConfigUtils.getConfigVec3(sensor.position),
      rotation: ConfigUtils.getConfigEuler(sensor.rotation),
      link: sensor.link,
      ...ConfigParamUtils.exportParams(sensor.params)
    }
  };
}