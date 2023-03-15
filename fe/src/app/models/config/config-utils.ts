import { Mark } from "js-yaml";
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
  return new THREE.Euler(...configEuler.map((x) => x * (Math.PI / 180.0)));
}

function getConfigVec3(threeVec3: THREE.Vector3): ConfigVec3 {
  return [threeVec3.x, threeVec3.y, threeVec3.z];
}

function getConfigEuler(threeVec3: THREE.Euler): ConfigVec3 {
  return [threeVec3.x, threeVec3.y, threeVec3.z].map(x => x * 180.0 / Math.PI) as ConfigVec3;
}

function parseTrajectories(parameters: Parameters) {
  const trajectories: Trajectory[] = [];
  Object.keys(parameters).forEach((x) => {
    if (parameters[x].type == 'trajectory') {
      const trj = new Trajectory({ name: x });
      const points = parameters[x].value as ConfigVec3[];

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
    if (parameters[x].children) {
      trajectories.push(...parseTrajectories(parameters[x].children!));
    }
  });
  return trajectories;
}

function updateTrajectoryParams (node: SceneNode, parameters: Parameters) {
  if (!parameters) {
    return;
  }

  Object.keys(parameters).forEach((key) => {
    if (parameters[key].type == 'trajectory') {
      const findTrajectory = node.children.find(x => x instanceof Trajectory && x.name == key);
      if (findTrajectory) {
        parameters[key].value = findTrajectory.children.map((point) => ConfigUtils.getConfigVec3((point as Marker).position));
      }
    }
    if (parameters[key].children) {
      updateTrajectoryParams(node, parameters[key].children!);
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