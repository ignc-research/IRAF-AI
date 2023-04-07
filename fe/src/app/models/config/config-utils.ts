import { Mark } from "js-yaml";
import { NumberUtils } from "src/app/helpers/number-utils";
import * as THREE from "three";
import { Marker } from "../marker";
import { Parameters } from "../parameters";
import { SceneNode } from "../scene-node";
import { Trajectory } from "../trajectory";
import { ConfigVec3 } from "./config-vec3";

function getThreeVec3(configVec: ConfigVec3) {
  return new THREE.Vector3(...configVec);
}

function getThreeEuler(configEuler: ConfigVec3) {
  return new THREE.Euler(...configEuler.map(NumberUtils.deg2Rad));
}

function getConfigVec3(threeVec3: THREE.Vector3): ConfigVec3 {
  return [threeVec3.x, threeVec3.y, threeVec3.z];
}

function getConfigEuler(threeVec3: THREE.Euler): ConfigVec3 {
  return [threeVec3.x, threeVec3.y, threeVec3.z].map(NumberUtils.rad2Deg) as ConfigVec3;
}

function parseTrajectories(parameters: Parameters) {
  const trajectories: Trajectory[] = [];
  parameters.forEach((param) => {
    if (param.type == 'trajectory') {
      const trj = new Trajectory({ name: param.key });
      const points = param.value as ConfigVec3[];

      points?.forEach((point: ConfigVec3, idx: number) =>
        trj.addChild(
          new Marker({
            name: idx.toString(),
            position: ConfigUtils.getThreeVec3(point),
          })
        )
      );
      trajectories.push(trj);
    }
    if (param.children) {
      trajectories.push(...parseTrajectories(param.children!));
    }
  });
  return trajectories;
}

function updateTrajectoryParams (node: SceneNode, parameters: Parameters) {
  if (!parameters) {
    return;
  }

  parameters.forEach((param) => {
    if (param.type == 'trajectory') {
      const findTrajectory = node.children.find(x => x instanceof Trajectory && x.name == param.key);
      if (findTrajectory) {
        param.value = findTrajectory.children.map((point) => ConfigUtils.getConfigVec3((point as Marker).position));
      }
    }
    if (param.children) {
      updateTrajectoryParams(node, param.children!);
    }
  });
}

export const ConfigUtils = {
  getThreeEuler,
  getThreeVec3,
  getConfigEuler,
  getConfigVec3,
  parseTrajectories,
  updateTrajectoryParams
}